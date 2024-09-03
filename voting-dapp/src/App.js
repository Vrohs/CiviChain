import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Row, Col, Button, Form, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import your contract ABI
import VotingContractABI from './QuadraticVotingContract.json';

const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null); 
  const [candidates, setCandidates] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, VotingContractABI.abi, signer);
        setContract(contract);

        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);

        // Load candidates and check if user is registered
        // You'll need to implement these functions in your contract
        const candidateList = await contract.getCandidates();
        setCandidates(candidateList);
        const registered = await contract.isRegistered(accounts[0]);
        setIsRegistered(registered);
      }
    };

    init();
  }, []);

  const registerVoter = async () => {
    if (contract) {
      await contract.registerVoter();
      setIsRegistered(true);
    }
  };

  const castVote = async (candidateId) => {
    if (contract && isRegistered) {
      await contract.castVote(candidateId);
      // Refresh candidate list after voting
      const updatedCandidates = await contract.getCandidates();
      setCandidates(updatedCandidates);
    }
  };

  return (
    <Container className="mt-5">
      <h1>Decentralized Voting System</h1>
      {!account ? (
        <Button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
          Connect Wallet
        </Button>
      ) : (
        <>
          <p>Connected Account: {account}</p>
          {!isRegistered ? (
            <Button onClick={registerVoter}>Register to Vote</Button>
          ) : (
            <ListGroup>
              {candidates.map((candidate, index) => (
                <ListGroup.Item key={index}>
                  {candidate.name} - Votes: {candidate.voteCount}
                  <Button onClick={() => castVote(index)} className="float-right">
                    Vote
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </>
      )}
    </Container>
  );
}

export default App;
