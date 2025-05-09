
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Home, ArrowRight, Wallet, Clock, BarChart3, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLayerZero } from '@/contexts/LayerZeroContext';

const Navbar = () => {
  const location = useLocation();
  const { chains, connectWallet, isConnecting } = useLayerZero();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChainMenu, setShowChainMenu] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <Wallet size={18} /> },
    { path: '/bridge', label: 'Bridge', icon: <ArrowRight size={18} /> },
    { path: '/history', label: 'History', icon: <Clock size={18} /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  ];

  const connectedChains = chains.filter(chain => chain.connected).length;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleChainMenu = () => {
    setShowChainMenu(!showChainMenu);
  };

  // Chain color mappings
  const chainColors = {
    solana: 'bg-gradient-to-r from-purple-500 to-fuchsia-500', 
    ethereum: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    avalanche: 'bg-gradient-to-r from-red-500 to-rose-600',
    polygon: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    bnb: 'bg-gradient-to-r from-yellow-400 to-amber-500',
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-nexus flex items-center justify-center mr-3 animate-pulse-glow">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold gradient-text">Warpgate</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-secondary'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Wallet Status */}
          <div className="hidden md:flex items-center">
            <Button
              variant="outline"
              className="mr-2 border-dashed relative"
              onClick={toggleChainMenu}
            >
              <span className="mr-2 text-sm font-medium">
                {connectedChains} of {chains.length}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showChainMenu ? 'rotate-180' : ''}`} />
            </Button>
            
            {/* Chain Selection Dropdown */}
            {showChainMenu && (
              <div className="absolute top-16 right-4 w-72 bg-card rounded-xl shadow-lg border border-border p-4 animate-fade-in z-50">
                <h3 className="font-medium text-sm text-muted-foreground mb-3">Select Chains</h3>
                <div className="space-y-3">
                  {chains.map((chain) => (
                    <div key={chain.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${chainColors[chain.type]}`}>
                          <span className="text-white text-sm">{chain.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium">{chain.name}</p>
                          {chain.connected && (
                            <p className="text-xs text-muted-foreground">{chain.balance} tokens</p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={chain.connected ? "secondary" : "default"}
                        onClick={() => chain.connected ? null : connectWallet(chain.type)}
                        disabled={isConnecting}
                        className={chain.connected ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" : `${chainColors[chain.type]} text-white hover:opacity-90`}
                      >
                        {chain.connected ? "Connected" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="default"
              className="bg-gradient-to-r from-nexus-blue via-nexus-purple to-nexus-teal hover:opacity-90 transition-opacity"
              onClick={() => connectWallet(chains.find(chain => !chain.connected)?.type || 'ethereum')}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : connectedChains > 0 ? "Manage Wallets" : "Connect"}
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-600"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg flex items-center ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              {chains.map((chain) => (
                <div key={chain.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${chainColors[chain.type]}`}>
                      <span className="text-white text-sm">{chain.icon}</span>
                    </div>
                    <span>{chain.name}</span>
                  </div>
                  <Button 
                    size="sm"
                    variant={chain.connected ? "secondary" : "default"}
                    onClick={() => chain.connected ? null : connectWallet(chain.type)}
                    disabled={isConnecting}
                    className={chain.connected ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" : `${chainColors[chain.type]} text-white hover:opacity-90`}
                  >
                    {chain.connected ? "Connected" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
