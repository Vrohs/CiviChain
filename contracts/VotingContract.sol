// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuadraticVotingContract {

    struct Candidate {

        string name;
        uint256 voteCount;
    }

    mapping(address => uint256) public voterCredits;
    mapping(address => mapping(uint256 => uint256)) public voterVotes;
    Candidate[] public candidates;
    bool public votingEnded;
    address public owner;
    uint256 public constant INITIAL_CREDITS = 100;

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

        require(voterCredits[msg.sender] == 0, "You have already registered.");
        voterCredits[msg.sender] = INITIAL_CREDITS;
    }


    function castVote(uint256 _candidateIndex, uint256 _voteStrength) public votingOngoing {

        require(voterCredits[msg.sender] > 0, "You must be registered to vote");
        require(_candidateIndex < candidates.length, "Invalid candidate index");
        
        uint256 voteCost = _voteStrength * _voteStrength;
        require(voterCredits[msg.sender] >= voteCost, "Insufficient credits");

        voterCredits[msg.sender] -= voteCost;
        voterVotes[msg.sender][_candidateIndex] += _voteStrength;
        candidates[_candidateIndex].voteCount += _voteStrength;
    }


    function getVoteCount(uint256 _candidateIndex) public view returns (uint256) {

        require(_candidateIndex < candidates.length, "Invalid candidate index");
        return candidates[_candidateIndex].voteCount;
    }


    function getRemainingCredits() public view returns (uint256) {

        return voterCredits[msg.sender];
    }


    function endVoting() public onlyOwner {

        votingEnded = true;
    }

