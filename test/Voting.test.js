const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("VotingContract", function () {

  it("Should register a voter", async function () {

    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = await VotingContract.deploy();
    await votingContract.deployed();

    await votingContract.registerVoter();
    const voter = await votingContract.voters(
      await ethers.provider.getSigner().getAddress()
    );

    expect(voter.registered).to.equal(true);
  });


});
