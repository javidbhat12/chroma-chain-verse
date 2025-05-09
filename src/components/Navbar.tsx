
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Home, ArrowRight, Wallet, Clock, BarChart3, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLayerZero } from '@/contexts/LayerZeroContext';

const Navbar = () => {
  const location = useLocation();
  const { chains, connectWallet } = useLayerZero();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-nexus flex items-center justify-center mr-3 animate-pulse-glow">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold gradient-text">Nexus</span>
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
              className="mr-2 border-dashed"
              onClick={() => {}}
            >
              <span className="mr-2 text-sm font-medium">
                {connectedChains} of {chains.length}
              </span>
              <ChevronDown size={16} />
            </Button>
            
            <Button
              variant="default"
              className="bg-gradient-nexus hover:opacity-90 transition-opacity"
            >
              Connect
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
              <Button 
                variant="default" 
                className="w-full bg-gradient-nexus hover:opacity-90 transition-opacity"
              >
                Connect
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
