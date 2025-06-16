import { ethers } from 'ethers';
import { electionvotingAddress } from '../config';
import VotingDApp from '../abi.json';

export const getContract = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Please install MetaMask to use this application');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(electionvotingAddress, VotingDApp.abi, signer);
  return contract;
};

export const createElection = async (title, description, startTime, endTime, enableWhitelist) => {
  try {
    const contract = await getContract();
    const tx = await contract.createElection(title, description, startTime, endTime, enableWhitelist);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error creating election:', error);
    throw error;
  }
};

export const addCandidate = async (electionId, name, info) => {
  try {
    const contract = await getContract();
    const tx = await contract.addCandidate(electionId, name, info);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }
};

export const castVote = async (electionId, candidateId) => {
  try {
    const contract = await getContract();
    const tx = await contract.castVote(electionId, candidateId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
};

export const getElection = async (electionId) => {
  try {
    const contract = await getContract();
    const election = await contract.getElection(electionId);
    return election;
  } catch (error) {
    console.error('Error getting election:', error);
    throw error;
  }
};

export const getElectionResults = async (electionId) => {
  try {
    const contract = await getContract();
    const results = await contract.getElectionResults(electionId);
    return results;
  } catch (error) {
    console.error('Error getting election results:', error);
    throw error;
  }
};

export const checkVoted = async (electionId) => {
  try {
    const contract = await getContract();
    const hasVoted = await contract.checkVoted(electionId);
    return hasVoted;
  } catch (error) {
    console.error('Error checking vote status:', error);
    throw error;
  }
};

export const checkWhitelisted = async (electionId) => {
  try {
    const contract = await getContract();
    const isWhitelisted = await contract.checkWhitelisted(electionId);
    return isWhitelisted;
  } catch (error) {
    console.error('Error checking whitelist status:', error);
    throw error;
  }
}; 