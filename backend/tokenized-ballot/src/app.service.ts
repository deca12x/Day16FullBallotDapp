import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/TokenizedBallot.json';

@Injectable()
export class AppService {
  provider: ethers.Provider;
  adminWallet: ethers.Wallet;
  myTokenContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL);
    this.adminWallet = new ethers.Wallet(
      process.env.PRIVATE_KEY,
      this.provider,
    );
    this.myTokenContract = new ethers.Contract(
      process.env.TOKEN_ADDRESS,
      tokenJson.abi,
      this.adminWallet,
    );
  }

  async getBlock(): Promise<string> {
    const provider = ethers.getDefaultProvider('sepolia');
    const lastBlockNumber = await provider.getBlockNumber();
    return `The last block number from Sepolia is ${lastBlockNumber}`;
  }

  async mintTokens(address: string) {
    const balance = await this.myTokenContract.balanceOf(address);
    if (balance.toString() !== '0') {
      return 'Already minted';
    }
    const mintTxResponse = await this.myTokenContract.mint(address, 100);
    const mintTxReceipt = await mintTxResponse.wait();
    return mintTxReceipt;
  }

  async delegate(userAddress: string) {
    const votingPower = await this.myTokenContract.getVotes(userAddress);
    if (votingPower.toString() !== '0') {
      return 'Already delegated';
    }
    const delegateTxResponse = await this.myTokenContract.delegate(userAddress);
    const delegateTxReceipt = await delegateTxResponse.wait();
    return delegateTxReceipt;
  }

  async balanceOf(address: string) {
    const balance = await this.myTokenContract.balanceOf(address);
    return balance.toString();
  }

  async votingPowerOf(address: string) {
    const votingPower = await this.myTokenContract.getVotes(address);
    return votingPower.toString();
  }

  async deployBallot(tokenAddress: string, _proposals: string[]) {
    const proposals = _proposals.map(ethers.encodeBytes32String);
    const ballotFactory = await new ethers.ContractFactory(
      ballotJson.abi,
      ballotJson.bytecode,
      this.adminWallet,
    );
    const ballotContract = await ballotFactory.deploy(proposals, tokenAddress);
    await ballotContract.waitForDeployment();
    return ballotContract;
  }

  async proposalData(ballotAddress: string, proposalsNumber: number) {
    const ballotContract = new ethers.Contract(
      ballotAddress,
      ballotJson.abi,
      this.adminWallet,
    );
    const proposals = new Array(proposalsNumber);
    for (let i = 0; i < proposalsNumber; i++) {
      const proposal = await ballotContract.proposals(i);
      const name = ethers.decodeBytes32String(proposal.name);
      const votes = proposal.voteCount.toString();
      proposals.push({ name, votes });
    }
    return proposals;
  }

  async vote(
    userAddress: string,
    ballotAddress: string,
    proposalNumber: number,
    voteWeight: number,
  ) {
    const votingPower = await this.myTokenContract.getVotes(userAddress);
    if (Number(votingPower.toString()) < voteWeight) {
      return 'Insufficient voting power';
    }
    const ballotContract = new ethers.Contract(
      ballotAddress,
      ballotJson.abi,
      this.adminWallet,
    );
    const voteTxResponse = await ballotContract.vote(
      proposalNumber,
      voteWeight,
    );
    const voteTxReceipt = await voteTxResponse.wait();
    return voteTxReceipt;
  }
}
