import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import WalletConnection from './components/WalletConnection';
import VoterRegistration from './components/VoterRegistration';
import CandidateList from './components/CandidateList';
import VotingInterface from './components/VotingInterface';
import ResultsSection from './components/ResultsSection';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        
        const signer = provider.getSigner();
        setSigner(signer);

        // Replace with your contract address and ABI
        const contractAddress = "YOUR_CONTRACT_ADDRESS";
        const contractABI = []; // Your contract ABI
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
      }
    };
    init();
  }, []);

  return (
    <div className="App">
      <Header />
      <WalletConnection provider={provider} setSigner={setSigner} />
      <VoterRegistration contract={contract} signer={signer} />
      <CandidateList contract={contract} />
      <VotingInterface contract={contract} signer={signer} />
      <ResultsSection contract={contract} />
    </div>
  );
}

export default App;
