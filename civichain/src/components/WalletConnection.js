import React, { useState } from 'react';

function WalletConnection({ provider, setSigner }) {
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    if (provider) {
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);
      setConnected(true);
    }
  };

  return (
    <div>
      <button onClick={connectWallet} disabled={connected}>
        {connected ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
    </div>
  );
}

export default WalletConnection;
