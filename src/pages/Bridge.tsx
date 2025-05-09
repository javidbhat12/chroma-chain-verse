
import { useState, useEffect } from 'react';
import { ArrowRight, HelpCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useLayerZero } from '@/contexts/LayerZeroContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Bridge = () => {
  const { 
    chains, 
    sourceChain, 
    destinationChain, 
    setSourceChain, 
    setDestinationChain,
    connectWallet,
    estimateGasFee,
    sendTransaction
  } = useLayerZero();
  
  const [amount, setAmount] = useState('');
  const [gasFee, setGasFee] = useState('0.00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the source and destination chain objects
  const sourceChainObj = sourceChain ? chains.find(c => c.type === sourceChain) : null;
  const destinationChainObj = destinationChain ? chains.find(c => c.type === destinationChain) : null;

  // Calculate total with gas fees
  const total = parseFloat(amount || '0') + parseFloat(gasFee);

  // Update gas fee estimate when source or destination changes
  useEffect(() => {
    const updateGasFee = async () => {
      if (sourceChain && destinationChain) {
        const fee = await estimateGasFee();
        setGasFee(fee);
      } else {
        setGasFee('0.00');
      }
    };

    updateGasFee();
  }, [sourceChain, destinationChain, estimateGasFee]);

  // Handle chain selection
  const handleSourceChainChange = (value: string) => {
    const chainType = value as any;
    setSourceChain(chainType);
    
    // Connect wallet if not already connected
    const chain = chains.find(c => c.type === chainType);
    if (chain && !chain.connected) {
      connectWallet(chainType);
    }
    
    // Reset destination if same as new source
    if (destinationChain === chainType) {
      setDestinationChain(null);
    }
  };

  const handleDestinationChainChange = (value: string) => {
    const chainType = value as any;
    setDestinationChain(chainType);
    
    // Connect wallet if not already connected
    const chain = chains.find(c => c.type === chainType);
    if (chain && !chain.connected) {
      connectWallet(chainType);
    }
  };

  // Handle max amount
  const handleMaxAmount = () => {
    if (sourceChainObj && sourceChainObj.connected) {
      setAmount(sourceChainObj.balance);
    }
  };

  // Handle bridge transaction
  const handleBridge = async () => {
    setIsSubmitting(true);
    
    try {
      const success = await sendTransaction(amount);
      if (success) {
        setAmount('');
      }
    } catch (error) {
      toast.error('Transaction failed');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Swap source and destination
  const handleSwapChains = () => {
    if (sourceChain && destinationChain) {
      setSourceChain(destinationChain);
      setDestinationChain(sourceChain);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" className="mr-2" onClick={() => history.back()}>
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-2xl font-bold">Bridge Assets</h1>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Cross-Chain Bridge</CardTitle>
              <CardDescription>Transfer assets between different blockchains using LayerZero V2</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Source Chain */}
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <Select
                  value={sourceChain || ""}
                  onValueChange={handleSourceChainChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select source chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map((chain) => (
                      <SelectItem 
                        key={chain.id} 
                        value={chain.type}
                        disabled={chain.type === destinationChain}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{chain.icon}</span>
                          <span>{chain.name}</span>
                          {chain.connected && (
                            <span className="ml-2 text-xs text-green-500">• Connected</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {sourceChainObj?.connected && (
                  <p className="text-xs text-muted-foreground">
                    Available: {sourceChainObj.balance} {sourceChainObj.type.substring(0, 3).toUpperCase()}
                  </p>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwapChains}
                  disabled={!sourceChain || !destinationChain}
                  className="rotate-90 hover:bg-secondary h-10 w-10 rounded-full"
                >
                  <ArrowRight size={18} />
                </Button>
              </div>

              {/* Destination Chain */}
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Select
                  value={destinationChain || ""}
                  onValueChange={handleDestinationChainChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select destination chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map((chain) => (
                      <SelectItem 
                        key={chain.id} 
                        value={chain.type}
                        disabled={chain.type === sourceChain}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{chain.icon}</span>
                          <span>{chain.name}</span>
                          {chain.connected && (
                            <span className="ml-2 text-xs text-green-500">• Connected</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {destinationChainObj?.connected && (
                  <p className="text-xs text-muted-foreground">
                    Balance: {destinationChainObj.balance} {destinationChainObj.type.substring(0, 3).toUpperCase()}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Amount</label>
                  {sourceChainObj?.connected && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-primary"
                      onClick={handleMaxAmount}
                    >
                      MAX
                    </Button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-16"
                    disabled={!sourceChain || !sourceChainObj?.connected}
                  />
                  {sourceChain && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium">
                      {sourceChain.substring(0, 3).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {sourceChain && destinationChain && amount && (
                <div className="rounded-lg bg-secondary p-4 space-y-2">
                  <h4 className="text-sm font-medium">Transaction Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span>You send</span>
                    <span>
                      {amount} {sourceChain.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <span>Gas fee</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                              <HelpCircle size={12} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-40 text-xs">
                              Gas fees cover the cost of processing your transaction across chains via LayerZero.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span>
                      {gasFee} {sourceChain.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {total.toFixed(4)} {sourceChain.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              {/* Warning for low balance */}
              {sourceChainObj && parseFloat(amount) > parseFloat(sourceChainObj.balance) && (
                <div className="flex items-center gap-2 text-sm text-amber-500 bg-amber-50 p-3 rounded-md">
                  <AlertTriangle size={16} />
                  <span>Insufficient balance for this transaction</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-omni hover:opacity-90"
                disabled={
                  !sourceChain ||
                  !destinationChain ||
                  !amount ||
                  parseFloat(amount) <= 0 ||
                  (sourceChainObj && parseFloat(amount) > parseFloat(sourceChainObj.balance)) ||
                  isSubmitting
                }
                onClick={handleBridge}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    Bridge Tokens
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Information Section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">About Cross-Chain Bridging</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                This bridge uses LayerZero V2 technology to enable secure asset transfers across different blockchains.
              </p>
              <p>
                Bridge times typically take between 1-3 minutes depending on network conditions.
              </p>
              <p>
                Always verify your destination address and make sure you have enough balance to cover gas fees on both chains.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bridge;
