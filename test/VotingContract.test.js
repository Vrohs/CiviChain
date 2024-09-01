const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract", function () {
  let VotingContract;
  let votingContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    VotingContract = await ethers.getContractFactory("VotingContract");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new VotingContract before each test
    const candidateNames = ["Candidate 1", "Candidate 2", "Candidate 3"];
    votingContract = await VotingContract.deploy(candidateNames);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await votingContract.owner()).to.equal(owner.address);
    });

    it("Should initialize candidates correctly", async function () {
      expect(await votingContract.getVoteCount(0)).to.equal(0);
      expect(await votingContract.getVoteCount(1)).to.equal(0);
      expect(await votingContract.getVoteCount(2)).to.equal(0);
    });
  });

  describe("Voting", function () {
    it("Should allow a voter to register", async function () {
      await votingContract.connect(addr1).registerVoter();
      expect(await votingContract.voters(addr1.address)).to.equal(true);
    });

    it("Should not allow a voter to register twice", async function () {
      await votingContract.connect(addr1).registerVoter();
      await expect(votingContract.connect(addr1).registerVoter()).to.be.revertedWith("You have already registered.");
    });

    it("Should allow a registered voter to cast a vote", async function () {
      await votingContract.connect(addr1).registerVoter();
      await votingContract.connect(addr1).castVote(0);
      expect(await votingContract.getVoteCount(0)).to.equal(1);
    });

    it("Should not allow an unregistered voter to cast a vote", async function () {
      await expect(votingContract.connect(addr1).castVote(0)).to.be.revertedWith("You must be registered to vote");
    });

    it("Should not allow a voter to vote twice", async function () {
      await votingContract.connect(addr1).registerVoter();
      await votingContract.connect(addr1).castVote(0);
      await expect(votingContract.connect(addr1).castVote(1)).to.be.revertedWith("You have already voted");
    });

    it("Should not allow voting for a non-existent candidate", async function () {
      await votingContract.connect(addr1).registerVoter();
      await expect(votingContract.connect(addr1).castVote(3)).to.be.revertedWith("Invalid candidate index");
    });
  });

  describe("End Voting", function () {
    it("Should allow only the owner to end voting", async function () {
      await votingContract.connect(owner).endVoting();
      expect(await votingContract.votingEnded()).to.equal(true);
    });

    it("Should not allow non-owners to end voting", async function () {
      await expect(votingContract.connect(addr1).endVoting()).to.be.revertedWith("Only the contract owner can call this function");
    });

    it("Should not allow voting after voting has ended", async function () {
      await votingContract.connect(owner).endVoting();
      await expect(votingContract.connect(addr1).registerVoter()).to.be.revertedWith("Voting has ended");
    });
  });

  describe("Get Winner", function () {
    it("Should correctly determine the winner", async function () {
      await votingContract.connect(addr1).registerVoter();
      await votingContract.connect(addr2).registerVoter();
      await votingContract.connect(addr1).castVote(0);
      await votingContract.connect(addr2).castVote(0);
      await votingContract.connect(owner).endVoting();
      expect(await votingContract.getWinner()).to.equal("Candidate 1");
    });

    it("Should not allow getting the winner before voting has ended", async function () {
      await expect(votingContract.getWinner()).to.be.revertedWith("Voting has not ended yet");
    });
  });
});