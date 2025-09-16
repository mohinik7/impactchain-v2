'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContractService } from '../services/contractService';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  address: string | null;
  isConnected: boolean;
  contractService: ContractService | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  address: null,
  isConnected: false,
  contractService: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contractService, setContractService] = useState<ContractService | null>(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application');
      }

      // Create a new provider instance
      const provider = new BrowserProvider(window.ethereum);
      setProvider(provider);

      // Request account access
      await provider.send('eth_requestAccounts', []);

      // Get the signer
      const signer = await provider.getSigner();
      setSigner(signer);

      // Get the connected address
      const address = await signer.getAddress();
      setAddress(address);

      // Initialize contract service
      const service = new ContractService(signer);
      setContractService(service);

      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setIsConnected(false);
    setContractService(null);
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        disconnectWallet();
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        address,
        isConnected,
        contractService,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}