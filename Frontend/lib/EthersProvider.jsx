"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../abi.json';
import {electionvotingAddress } from '../config';

const EthersContext = createContext({
  provider: null,
  signer: null,
  contract: null,
  account: null,
  loading: true,
  error: null,
  connectWallet: async () => {},
});

export function EthersProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initEthers = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);

          // Check if already connected
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            const contract = new ethers.Contract(electionvotingAddress, contractABI.abi, signer);
            
            setSigner(signer);
            setContract(contract);
            setAccount(accounts[0]);
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length === 0) {
              setAccount(null);
              setSigner(null);
              setContract(null);
            } else {
              const signer = provider.getSigner();
              const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
              setSigner(signer);
              setContract(contract);
              setAccount(accounts[0]);
            }
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        }
      } catch (err) {
        console.error('Error initializing ethers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initEthers();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!provider) throw new Error('Provider not initialized');
      
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(electionvotingAddress, contractABI.abi, signer);
      
      setSigner(signer);
      setContract(contract);
      setAccount(accounts[0]);
      setError(null);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
    }
  };

  const value = {
    provider,
    signer,
    contract,
    account,
    loading,
    error,
    connectWallet
  };

  return (
    <EthersContext.Provider value={value}>
      {children}
    </EthersContext.Provider>
  );
}

export function useEthers() {
  const context = useContext(EthersContext);
  if (context === undefined) {
    throw new Error('useEthers must be used within an EthersProvider');
  }
  return context;
} 