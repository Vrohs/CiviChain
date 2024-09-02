// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {

    struct Candidate {

        string name;
        uint256 voteCount;    // unsigned c-like 256 bit integer var 
    }

// required variables 
    mapping(address => bool) public voters;       // key value relation for determining if a user has voted 
    mapping(address => bool) public hasVoted;
    Candidate[] public candidates;                // ar of candidates
    bool public votingEnded;         
    address public owner;


    constructor(string[] memory _candidateNames) {

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }

        owner = msg.sender;
        votingEnded = false;
    }


    modifier onlyOwner() {

        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }


    modifier votingOngoing() {
    
        require(!votingEnded, "Voting has ended");
        _;
    }


    function registerVoter() public votingOngoing {

        require(!voters[msg.sender], "You have already registered.");
        voters[msg.sender] = true;
    }


    function castVote(uint256 _candidateIndex) public votingOngoing {

        require(voters[msg.sender], "You must be registered to vote");
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateIndex < candidates.length, "Invalid candidate index");

        candidates[_candidateIndex].voteCount++;
        hasVoted[msg.sender] = true;
    }

