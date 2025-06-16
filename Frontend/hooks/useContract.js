import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import * as contractUtils from '../lib/contract';

export const useContract = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } else {
        throw new Error('Please install MetaMask to use this application');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const createElection = async (title, description, startTime, endTime, enableWhitelist) => {
    try {
      setLoading(true);
      const tx = await contractUtils.createElection(title, description, startTime, endTime, enableWhitelist);
      return tx;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async (electionId, name, info) => {
    try {
      setLoading(true);
      const tx = await contractUtils.addCandidate(electionId, name, info);
      return tx;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (electionId, candidateId) => {
    try {
      setLoading(true);
      const tx = await contractUtils.castVote(electionId, candidateId);
      return tx;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getElection = async (electionId) => {
    try {
      setLoading(true);
      const election = await contractUtils.getElection(electionId);
      return election;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getElectionResults = async (electionId) => {
    try {
      setLoading(true);
      const results = await contractUtils.getElectionResults(electionId);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkVoted = async (electionId) => {
    try {
      setLoading(true);
      const hasVoted = await contractUtils.checkVoted(electionId);
      return hasVoted;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkWhitelisted = async (electionId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      return await contract.checkWhitelisted(electionId, account);
    } catch (err) {
      console.error('Error checking whitelist status:', err);
      throw err;
    }
  };

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
    checkWhitelisted,
  };
}; 