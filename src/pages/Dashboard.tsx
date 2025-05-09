
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart3, 
  ExternalLink
} from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const navigate = useNavigate();
  const { chains, transactions, connectWallet, disconnectWallet } = useLayerZero();
  const [selectedTab, setSelectedTab] = useState('wallets');

  // Get the last 5 transactions for the recent activity
  const recentTransactions = transactions.slice(0, 5);

  // Calculate total balance across all chains
  const totalBalance = chains.reduce((sum, chain) => sum + parseFloat(chain.balance), 0).toFixed(2);

  // Format timestamp to relative time
  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen pt-16 pb-10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Welcome Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Welcome to <span className="gradient-text">OmniPortal</span>
                </CardTitle>
                <CardDescription>
                  Your dashboard for cross-chain interactions via LayerZero V2
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Balance</p>
                    <p className="text-3xl font-bold">${totalBalance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Connected Wallets</p>
                    <p className="text-3xl font-bold">{chains.filter(c => c.connected).length}/{chains.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-3xl font-bold">{transactions.length}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4">
                  <Button 
                    className="bg-gradient-omni hover:opacity-90" 
                    onClick={() => navigate('/bridge')}
                  >
                    Bridge Assets
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/history')} 
                  >
                    View History
                    <Clock size={16} className="ml-2" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Wallets Section */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Your Wallets</CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant={selectedTab === 'wallets' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setSelectedTab('wallets')}
                      className={selectedTab === 'wallets' ? 'bg-primary' : ''}
                    >
                      Wallets
                    </Button>
                    <Button 
                      variant={selectedTab === 'activity' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setSelectedTab('activity')}
                      className={selectedTab === 'activity' ? 'bg-primary' : ''}
                    >
                      Recent Activity
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {selectedTab === 'wallets' ? (
                  <div className="space-y-4">
                    {chains.map((chain) => (
                      <div 
                        key={chain.id} 
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl">
                            {chain.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{chain.name}</h3>
                            {chain.connected ? (
                              <p className="text-sm text-muted-foreground">
                                {chain.balance} {chain.type.toUpperCase().substring(0, 3)}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">Not connected</p>
                            )}
                          </div>
                        </div>
                        <div>
                          {chain.connected ? (
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => disconnectWallet(chain.type)}
                            >
                              Disconnect
                            </Button>
                          ) : (
                            <Button 
                              variant="outline"
                              size="sm"
                              className="border-dashed"
                              onClick={() => connectWallet(chain.type)}
                            >
                              <Plus size={16} className="mr-1" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((tx) => (
                        <div 
                          key={tx.id} 
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.status === 'completed' ? 'bg-green-100 text-green-600' : 
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                              'bg-red-100 text-red-600'
                            }`}>
                              {tx.status === 'completed' ? (
                                <CheckCircle size={20} />
                              ) : tx.status === 'pending' ? (
                                <Clock size={20} />
                              ) : (
                                <XCircle size={20} />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {tx.sourceChain.charAt(0).toUpperCase() + tx.sourceChain.slice(1)} to {tx.destinationChain.charAt(0).toUpperCase() + tx.destinationChain.slice(1)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {tx.amount} {tx.sourceChain.substring(0, 3).toUpperCase()} • {getRelativeTime(tx.timestamp)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={() => window.open(`https://layerzeroscan.com/tx/${tx.hash}`, '_blank')}
                          >
                            <ExternalLink size={14} />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="w-full lg:w-1/3 space-y-8">
            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-between" 
                  onClick={() => navigate('/bridge')}
                >
                  Bridge Assets
                  <ArrowRight size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between" 
                  onClick={() => navigate('/history')}
                >
                  Transaction History
                  <Clock size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between" 
                  onClick={() => navigate('/analytics')}
                >
                  Analytics
                  <BarChart3 size={16} />
                </Button>
              </CardContent>
            </Card>
            
            {/* Network Status */}
            <Card>
              <CardHeader>
                <CardTitle>Network Status</CardTitle>
                <CardDescription>Current LayerZero network conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Solana ➔ Ethereum</span>
                    <span className="text-sm text-green-500">Healthy</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Ethereum ➔ Solana</span>
                    <span className="text-sm text-green-500">Healthy</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Solana ➔ Avalanche</span>
                    <span className="text-sm text-yellow-500">Congested</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Average Transaction Time</span>
                  </div>
                  <p className="text-2xl font-semibold">~2.3 minutes</p>
                </div>
              </CardContent>
            </Card>

            {/* Learn More */}
            <Card>
              <CardHeader>
                <CardTitle>Learn About LayerZero V2</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  LayerZero is an omnichain interoperability protocol designed for lightweight cross-chain message passing.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary" onClick={() => window.open('https://layerzero.network', '_blank')}>
                  Learn more about LayerZero V2
                  <ExternalLink size={14} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
