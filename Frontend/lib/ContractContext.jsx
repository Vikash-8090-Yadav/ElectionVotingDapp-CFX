"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useContract } from '../hooks/useContract';

const ContractContext = createContext(null);

export const ContractProvider = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const contract = useContract();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <ContractContext.Provider value={contract}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContractContext = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContractContext must be used within a ContractProvider');
  }
  return context;
}; 