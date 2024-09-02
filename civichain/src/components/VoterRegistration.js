import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './VoterRegistration.css'; // We'll create this file for styling

// Import your contract ABI and address
import VotingContractABI from '../QuadraticVotingContract.json';
const contractAddress = "VotingContractABI";

function VoterRegistration() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const signer = provider.getSigner();
        setSigner(signer);

        const contract = new ethers.Contract(contractAddress, VotingContractABI.abi, signer);
        setContract(contract);
      } else {
        setMessage('Please install MetaMask!');
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setMessage('Wallet connected!');
    } catch (error) {
      setMessage('Failed to connect wallet: ' + error.message);
    }
  };

  const registerVoter = async () => {
    if (!contract) {
      setMessage('Contract not initialized');
      return;
    }

    try {
      const tx = await contract.registerVoter();
      await tx.wait();
      setIsRegistered(true);
      setMessage('You are now registered as a voter!');
    } catch (error) {
      setMessage('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="voter-registration">
      <h1>Voter Registration</h1>
      <button onClick={connectWallet} className="connect-button">
        Connect Wallet
      </button>
      <button onClick={registerVoter} className="register-button" disabled={isRegistered}>
        {isRegistered ? 'Already Registered' : 'Register as Voter'}
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default VoterRegistration;
