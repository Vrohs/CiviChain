const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuadraticVotingContract", function () {
  let QuadraticVotingContract;
  let quadraticVotingContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    QuadraticVotingContract = await ethers.getContractFactory("QuadraticVotingContract");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const candidateNames = ["Candidate 1", "Candidate 2", "Candidate 3"];
    quadraticVotingContract = await QuadraticVotingContract.deploy(candidateNames);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await quadraticVotingContract.owner()).to.equal(owner.address);
    });

    it("Should initialize candidates correctly", async function () {
      expect(await quadraticVotingContract.getVoteCount(0)).to.equal(0);
      expect(await quadraticVotingContract.getVoteCount(1)).to.equal(0);
      expect(await quadraticVotingContract.getVoteCount(2)).to.equal(0);
    });
  });

  describe("Voting", function () {
    it("Should allow a voter to register and receive credits", async function () {
      await quadraticVotingContract.connect(addr1).registerVoter();
      expect(await quadraticVotingContract.voterCredits(addr1.address)).to.equal(100);
    });

    it("Should not allow a voter to register twice", async function () {
      await quadraticVotingContract.connect(addr1).registerVoter();
      await expect(quadraticVotingContract.connect(addr1).registerVoter()).to.be.revertedWith("You have already registered.");
    });

    it("Should allow a registered voter to cast a vote with quadratic cost", async function () {
      await quadraticVotingContract.connect(addr1).registerVoter();
      await quadraticVotingContract.connect(addr1).castVote(0, 3); // Vote strength of 3
      expect(await quadraticVotingContract.getVoteCount(0)).to.equal(3);
      expect(await quadraticVotingContract.connect(addr1).getRemainingCredits()).to.equal(91); // 100 - 3^2
    });

    it("Should not allow an unregistered voter to cast a vote", async function () {
      await expect(quadraticVotingContract.connect(addr1).castVote(0, 2)).to.be.revertedWith("You must be registered to vote");
    });

    it("Should not allow voting for a non-existent candidate", async function () {
      await quadraticVotingContract.connect(addr1).registerVoter();
      await expect(quadraticVotingContract.connect(addr1).castVote(3, 1)).to.be.revertedWith("Invalid candidate index");
    });

    it("Should not allow a voter to exceed their credits", async function () {
      await quadraticVotingContract.connect(addr1).registerVoter();
      await expect(quadraticVotingContract.connect(addr1).castVote(0, 11)).to.be.revertedWith("Insufficient credits");
    });
  });

  describe("End Voting", function () {
    it("Should allow only the owner to end voting", async function () {
      await quadraticVotingContract.connect(owner).endVoting();
      expect(await quadraticVotingContract.votingEnded()).to.equal(true);
    });

    it("Should not allow non-owners to end voting", async function () {
      await expect(quadraticVotingContract.connect(addr1).endVoting()).to.be.revertedWith("Only the contract owner can call this function");
    });

    it("Should not allow voting after voting has ended", async function () {
      await quadraticVotingContract.connect(owner).endVoting();
      await expect(quadraticVotingContract.connect(addr1).registerVoter()).to.be.revertedWith("Voting has ended");
    });
  });

  describe("Get Winner", function () {
    it("Should correctly determine the winner", async function () {
      await quadraticVotingContract.connect(addr1).registerVoter();
      await quadraticVotingContract.connect(addr2).registerVoter();
      await quadraticVotingContract.connect(addr1).castVote(0, 3);
      await quadraticVotingContract.connect(addr2).castVote(0, 2);
      await quadraticVotingContract.connect(owner).endVoting();
      expect(await quadraticVotingContract.getWinner()).to.equal("Candidate 1");
    });

    it("Should not allow getting the winner before voting has ended", async function () {
      await expect(quadraticVotingContract.getWinner()).to.be.revertedWith("Voting has not ended yet");
    });
  });
});