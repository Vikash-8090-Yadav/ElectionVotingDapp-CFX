"use client";

import { useState, useEffect, useCallback } from 'react';
import contractABI from '../abi.json';
import { CONTRACT_ADDRESS } from '../config';
import { getProvider, getContract } from '../lib/ethers';

export const useContract = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application');
      }

      const provider = getProvider();
      if (!provider) throw new Error('Failed to get provider');

      const accounts = await provider.send('eth_requestAccounts', []);
      const contract = getContract(CONTRACT_ADDRESS, contractABI.abi);

      setAccount(accounts[0]);
      setProvider(provider);
      setContract(contract);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error connecting wallet:', err);
    }
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const provider = getProvider();
          if (!provider) return;

          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const contract = getContract(CONTRACT_ADDRESS, contractABI.abi);
            
            setAccount(accounts[0]);
            setProvider(provider);
            setContract(contract);
          }
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setContract(null);
        } else {
          connectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [connectWallet]);

  const createElection = useCallback(async (title, description, startTime, endTime) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const tx = await contract.createElection(title, description, startTime, endTime);
      await tx.wait();
      return tx;
    } catch (err) {
      console.error('Error creating election:', err);
      throw err;
    }
  }, [contract]);

  const addCandidate = useCallback(async (electionId, name, description) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const tx = await contract.addCandidate(electionId, name, description);
      await tx.wait();
      return tx;
    } catch (err) {
      console.error('Error adding candidate:', err);
      throw err;
    }
  }, [contract]);

  const castVote = useCallback(async (electionId, candidateId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const tx = await contract.castVote(electionId, candidateId);
      await tx.wait();
      return tx;
    } catch (err) {
      console.error('Error casting vote:', err);
      throw err;
    }
  }, [contract]);

  const getElection = useCallback(async (electionId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      return await contract.getElection(electionId);
    } catch (err) {
      console.error('Error getting election:', err);
      throw err;
    }
  }, [contract]);

  const getElectionResults = useCallback(async (electionId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      return await contract.getElectionResults(electionId);
    } catch (err) {
      console.error('Error getting election results:', err);
      throw err;
    }
  }, [contract]);

  const checkVoted = useCallback(async (electionId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      return await contract.hasVoted(electionId);
    } catch (err) {
      console.error('Error checking vote status:', err);
      throw err;
    }
  }, [contract]);

  const checkWhitelisted = useCallback(async (electionId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      return await contract.isWhitelisted(electionId);
    } catch (err) {
      console.error('Error checking whitelist status:', err);
      throw err;
    }
  }, [contract]);

  return {
    account,
    loading,
    error,
    connectWallet,
    createElection,
    addCandidate,
    castVote,
    getElection,
    getElectionResults,
    checkVoted,
    checkWhitelisted
  };
}; 