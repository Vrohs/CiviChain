import React, { useState } from 'react';

function VoterRegistration({ contract, signer }) {
  const [registered, setRegistered] = useState(false);

  const registerVoter = async () => {
    if (contract && signer) {
      try {
        const tx = await contract.registerVoter();
        await tx.wait();
        setRegistered(true);
      } catch (error) {
        console.error("Error registering voter:", error);
      }
    }
  };

  return (
    <div>
      <button onClick={registerVoter} disabled={registered}>
        {registered ? 'Registered' : 'Register to Vote'}
      </button>
    </div>
  );
}

export default VoterRegistration;
