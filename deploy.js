const hre = require("hardhat");

async function main() {
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  
  // Create an array of candidate names to pass to the constructor
  const candidateNames = ["Candidate 1", "Candidate 2", "Candidate 3"];

  const votingContract = await VotingContract.deploy(candidateNames);

  await votingContract.waitForDeployment();

  console.log("VotingContract deployed to:", await votingContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
