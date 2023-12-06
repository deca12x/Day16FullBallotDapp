import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GiveAddressDto } from './dtos/giveAddress.dto';
import { GiveProposalsDto } from './dtos/giveProposals.dto';
import { GiveNumberDto } from './dtos/giveNumber.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-block')
  getBlock(): Promise<string> {
    return this.appService.getBlock();
  }

  @Post('mint-delegate-balance-votingpower')
  async mintTokens(@Body() body: GiveAddressDto) {
    return {
      mintTxReceipt: await this.appService.mintTokens(body.walletAddress),
      delegateTxReceipt: await this.appService.delegate(body.walletAddress),
      balance: await this.appService.balanceOf(body.walletAddress),
      votingPower: await this.appService.votingPowerOf(body.walletAddress),
    };
  }

  @Post('balance-votingpower')
  async getBalance(@Body() body: GiveAddressDto) {
    return {
      balance: await this.appService.balanceOf(body.walletAddress),
      votingPower: await this.appService.votingPowerOf(body.walletAddress),
    };
  }

  @Post('deployballot-proposaldata')
  async deployBallot(@Body() body: [GiveAddressDto, GiveProposalsDto]) {
    return {
      deployTxReceipt: await this.appService.deployBallot(
        body[0].contractAddress,
        body[1].proposals,
      ),
    };
  }

  @Post('proposaldata')
  async getProposalData(@Body() body: [GiveAddressDto, GiveNumberDto]) {
    return {
      proposalData: await this.appService.proposalData(
        body[0].contractAddress,
        body[1].number,
      ),
    };
  }

  @Post('vote')
  async vote(
    @Body()
    body: [GiveAddressDto, GiveNumberDto],
  ) {
    return {
      voteTxReceipt: await this.appService.vote(
        body[0].walletAddress,
        body[0].contractAddress,
        body[1].number,
        body[1].voteWeight,
      ),
    };
  }
}
