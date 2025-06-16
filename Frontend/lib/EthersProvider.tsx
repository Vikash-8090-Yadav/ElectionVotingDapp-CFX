import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { electionvotingAddress } from "../config";
import abi from "../abi.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface EthersContextType {
  provider: ethers.providers.Web3Provider | null;
  contract: Contract | null;
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const EthersContext = createContext<EthersContextType>({
  provider: null,
  contract: null,
  account: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
});

export function EthersProvider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const initContract = async (provider: ethers.providers.Web3Provider, account: string) => {
    try {
      console.log('Initializing contract...');
      const signer = provider.getSigner();
      const contractAddress = electionvotingAddress;
      
      if (!contractAddress) {
        console.error('Contract address not found');
        return;
      }

      console.log('Creating contract instance with address:', contractAddress);
      
      // Get contract bytecode to verify it's the right contract
      const bytecode = await provider.getCode(contractAddress);
      console.log('Contract bytecode length:', bytecode.length);
      
      // Create contract instance with the full ABI
      const contract = new ethers.Contract(
        contractAddress,
        abi.abi,
        signer
      );

      // Log available functions
      console.log('Contract functions:', Object.keys(contract.functions));
      console.log('Contract interface:', contract.interface.format());
      
      // Test if addCandidate exists
      if (typeof contract.addCandidate !== 'function') {
        console.error('addCandidate function not found in contract');
        console.log('Available functions:', Object.keys(contract.functions));
        
        // Try to get the function directly
        try {
          const addCandidateFunction = contract.interface.getFunction('addCandidate');
          console.log('addCandidate function definition:', addCandidateFunction);
        } catch (error) {
          console.error('Error getting addCandidate function:', error);
        }
      }

      setContract(contract);
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  };

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      console.error('MetaMask is not installed');
      return;
    }

    try {
      setIsConnecting(true);
      console.log('Connecting to MetaMask...');
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Request account access
      const accounts = await provider.send("eth_requestAccounts", []);
      console.log('Connected accounts:', accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log('Setting account:', account);
        setAccount(account);
        await initContract(provider, account);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    console.log('Disconnecting...');
    setAccount(null);
    setContract(null);
    setProvider(null);
  };

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum === "undefined") {
        console.log('MetaMask is not installed');
        return;
      }

      try {
        console.log('Initializing provider...');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        // Check if already connected
        const accounts = await provider.listAccounts();
        console.log('Existing accounts:', accounts);

        if (accounts.length > 0) {
          const account = accounts[0];
          console.log('Setting existing account:', account);
          setAccount(account);
          await initContract(provider, account);
        }

        // Listen for account changes
        window.ethereum.on("accountsChanged", async (accounts: string[]) => {
          console.log('Accounts changed:', accounts);
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await initContract(provider, accounts[0]);
          } else {
            disconnect();
          }
        });

        // Listen for chain changes
        window.ethereum.on("chainChanged", () => {
          console.log('Chain changed, reloading...');
          window.location.reload();
        });
      } catch (error) {
        console.error('Error in initialization:', error);
      }
    };

    init();

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return (
    <EthersContext.Provider value={{ provider, contract, account, connect, disconnect, isConnecting }}>
      {children}
    </EthersContext.Provider>
  );
}

export const useEthers = () => useContext(EthersContext); 