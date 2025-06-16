"use client";

import { ethers } from 'ethers';

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const getContract = (address, abi) => {
  const provider = getProvider();
  if (!provider) return null;
  
  const signer = provider.getSigner();
  return new ethers.Contract(address, abi, signer);
}; 