
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

// Define the available chains
export type ChainType = 'solana' | 'ethereum' | 'avalanche' | 'polygon' | 'bnb';

interface ChainInfo {
  id: number;
  name: string;
  type: ChainType;
  icon: string;
  connected: boolean;
  balance: string;
}

interface LayerZeroContextType {
  chains: ChainInfo[];
  sourceChain: ChainType | null;
  destinationChain: ChainType | null;
  isConnecting: boolean;
  connectWallet: (chainType: ChainType) => void;
  disconnectWallet: (chainType: ChainType) => void;
  setSourceChain: (chain: ChainType | null) => void;
  setDestinationChain: (chain: ChainType | null) => void;
  estimateGasFee: () => Promise<string>;
  sendTransaction: (amount: string) => Promise<boolean>;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  sourceChain: ChainType;
  destinationChain: ChainType;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  hash: string;
}

// Create the context
const LayerZeroContext = createContext<LayerZeroContextType | undefined>(undefined);

// Mock chain data for our UI
const initialChains: ChainInfo[] = [
  {
    id: 1,
    name: 'Solana',
    type: 'solana',
    icon: '⚡',
    connected: false,
    balance: '0.00'
  },
  {
    id: 2,
    name: 'Ethereum',
    type: 'ethereum',
    icon: '💎',
    connected: false,
    balance: '0.00'
  },
  {
    id: 3,
    name: 'Avalanche',
    type: 'avalanche',
    icon: '❄️',
    connected: false,
    balance: '0.00'
  },
  {
    id: 4,
    name: 'Polygon',
    type: 'polygon',
    icon: '🔷',
    connected: false,
    balance: '0.00'
  },
  {
    id: 5,
    name: 'BNB Chain',
    type: 'bnb',
    icon: '🟡',
    connected: false,
    balance: '0.00'
  }
];

// Sample transactions for the history page
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    sourceChain: 'solana',
    destinationChain: 'ethereum',
    amount: '1.5',
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000),
    hash: '0x123...abc'
  },
  {
    id: '2',
    sourceChain: 'ethereum',
    destinationChain: 'solana',
    amount: '0.5',
    status: 'completed',
    timestamp: new Date(Date.now() - 7200000),
    hash: '0x456...def'
  },
  {
    id: '3',
    sourceChain: 'solana',
    destinationChain: 'avalanche',
    amount: '10',
    status: 'pending',
    timestamp: new Date(),
    hash: '0x789...ghi'
  }
];

export const LayerZeroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chains, setChains] = useState<ChainInfo[]>(initialChains);
  const [sourceChain, setSourceChain] = useState<ChainType | null>(null);
  const [destinationChain, setDestinationChain] = useState<ChainType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);

  // Connect wallet mock function
  const connectWallet = (chainType: ChainType) => {
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setChains(chains.map(chain => {
        if (chain.type === chainType) {
          const mockBalance = (Math.random() * 10).toFixed(2);
          return { ...chain, connected: true, balance: mockBalance };
        }
        return chain;
      }));
      
      setIsConnecting(false);
      toast.success(`Connected to ${chainType.charAt(0).toUpperCase() + chainType.slice(1)}`);
    }, 1500);
  };

  // Disconnect wallet mock function
  const disconnectWallet = (chainType: ChainType) => {
    setChains(chains.map(chain => {
      if (chain.type === chainType) {
        return { ...chain, connected: false, balance: '0.00' };
      }
      return chain;
    }));

    // If source or destination chain was disconnected, reset it
    if (sourceChain === chainType) setSourceChain(null);
    if (destinationChain === chainType) setDestinationChain(null);

    toast.info(`Disconnected from ${chainType.charAt(0).toUpperCase() + chainType.slice(1)}`);
  };

  // Estimate gas fee for cross-chain transaction
  const estimateGasFee = async (): Promise<string> => {
    // Mock gas estimation for now
    return new Promise(resolve => {
      setTimeout(() => {
        const fee = (Math.random() * 0.05).toFixed(4);
        resolve(fee);
      }, 800);
    });
  };

  // Send cross-chain transaction
  const sendTransaction = async (amount: string): Promise<boolean> => {
    if (!sourceChain || !destinationChain) {
      toast.error('Source and destination chains must be selected');
      return false;
    }

    const sourceChainInfo = chains.find(c => c.type === sourceChain);
    
    if (!sourceChainInfo?.connected) {
      toast.error(`${sourceChainInfo?.name} wallet not connected`);
      return false;
    }

    if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
      toast.error('Enter a valid amount');
      return false;
    }

    if (parseFloat(sourceChainInfo.balance) < parseFloat(amount)) {
      toast.error('Insufficient balance');
      return false;
    }

    // Create transaction
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      sourceChain,
      destinationChain,
      amount,
      status: 'pending',
      timestamp: new Date(),
      hash: `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
    };

    setTransactions([newTransaction, ...transactions]);

    // Update balances (mock)
    setChains(chains.map(chain => {
      if (chain.type === sourceChain) {
        const newBalance = (parseFloat(chain.balance) - parseFloat(amount)).toFixed(2);
        return { ...chain, balance: newBalance };
      }
      if (chain.type === destinationChain) {
        // Add a random delay before receiving on destination chain
        setTimeout(() => {
          setChains(prevChains => {
            return prevChains.map(c => {
              if (c.type === destinationChain) {
                const newBalance = (parseFloat(c.balance) + parseFloat(amount)).toFixed(2);
                return { ...c, balance: newBalance };
              }
              return c;
            });
          });

          // Update transaction status to completed
          setTransactions(prevTxns => {
            return prevTxns.map(tx => {
              if (tx.id === newTransaction.id) {
                return { ...tx, status: 'completed' };
              }
              return tx;
            });
          });

          toast.success('Transaction completed!');
        }, 5000 + Math.random() * 5000);
      }
      return chain;
    }));

    toast.success('Transaction submitted!');
    return true;
  };

  return (
    <LayerZeroContext.Provider 
      value={{
        chains,
        sourceChain,
        destinationChain,
        isConnecting,
        connectWallet,
        disconnectWallet,
        setSourceChain,
        setDestinationChain,
        estimateGasFee,
        sendTransaction,
        transactions
      }}
    >
      {children}
    </LayerZeroContext.Provider>
  );
};

// Custom hook for using the LayerZero context
export const useLayerZero = (): LayerZeroContextType => {
  const context = useContext(LayerZeroContext);
  
  if (context === undefined) {
    throw new Error('useLayerZero must be used within a LayerZeroProvider');
  }
  
  return context;
};
