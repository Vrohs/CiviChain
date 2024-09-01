const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract", function () {
  it("Should register a voter", async function () {
    const VotingContract = await ethers.getContractFactory("VotingContract");
    
    // Create an array of candidate names to pass to the constructor
    const candidateNames = ["Candidate 1", "Candidate 2", "Candidate 3"];
    
    const votingContract = await VotingContract.deploy(candidateNames);

    const [signer] = await ethers.getSigners();
    const voterAddress = await signer.getAddress();

    await votingContract.registerVoter();

    const isRegistered = await votingContract.voters(voterAddress);
    expect(isRegistered).to.equal(true);
  });
});