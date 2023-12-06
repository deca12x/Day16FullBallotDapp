// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
	function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
	struct Proposal {
		bytes32 name;
		uint256 voteCount;
	}

	// State variables
	IMyToken public tokenContract;
	Proposal[] public proposals;
	uint256 public voteFreezeBlockNumber;
	mapping(address => uint256) votingPowerSpent;

	constructor(bytes32[] memory _proposalNames, IMyToken _tokenContract) {
		tokenContract = _tokenContract;
		voteFreezeBlockNumber = block.number;
		for (uint i = 0; i < _proposalNames.length; i++) {
			proposals.push(Proposal({ name: _proposalNames[i], voteCount: 0 }));
		}
	}

	function vote(uint256 proposal, uint256 amount) external {
		require(
			votingPower(msg.sender) >= amount,
			"TokenizedBallot: trying to vote more than allowed"
		);
		votingPowerSpent[msg.sender] += amount;
		proposals[proposal].voteCount += amount;
	}

	function votingPower(address account) public view returns (uint256) {
		return
			tokenContract.getPastVotes(account, voteFreezeBlockNumber) -
			votingPowerSpent[account];
	}

	function winningProposal() public view returns (uint256 winningProposal_) {
		uint256 winningVoteCount = 0;
		for (uint256 p = 0; p < proposals.length; p++) {
			if (proposals[p].voteCount > winningVoteCount) {
				winningVoteCount = proposals[p].voteCount;
				winningProposal_ = p;
			}
		}
	}

	function winnerName() external view returns (bytes32 winnerName_) {
		winnerName_ = proposals[winningProposal()].name;
	}
}
