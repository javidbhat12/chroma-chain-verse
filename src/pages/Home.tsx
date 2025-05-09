
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Multi-Chain Support',
      description: 'Seamlessly connect and transact across multiple blockchains including Solana and Ethereum',
      icon: '🌐'
    },
    {
      title: 'Bridge Assets',
      description: 'Transfer tokens between chains with low fees and blazing fast finality',
      icon: '🌉'
    },
    {
      title: 'Track Transactions',
      description: 'Monitor all your cross-chain transactions from a single dashboard',
      icon: '📊'
    },
    {
      title: 'LayerZero V2',
      description: 'Powered by the latest LayerZero protocol for maximum security and efficiency',
      icon: '⚡'
    }
  ];

  const stats = [
    { value: '$2B+', label: 'Total Volume' },
    { value: '5M+', label: 'Transactions' },
    { value: '10+', label: 'Chains' },
    { value: '100%', label: 'Secure' }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Cross-Chain</span> Interoperability Made Simple
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground">
              Warpgate connects blockchains together with seamless, secure transfers and messaging powered by LayerZero V2.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-gradient-nexus hover:opacity-90 transition-opacity text-white px-8 py-6"
                onClick={() => navigate('/bridge')}
                size="lg"
              >
                Start Bridging
                <ArrowRight className="ml-2" size={18} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end animate-fade-in">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-nexus opacity-75 blur-lg"></div>
              <div className="relative bg-card rounded-2xl p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <div className="flex items-center mt-1">
                        <div className="w-8 h-8 bg-[#9945FF] rounded-full flex items-center justify-center">
                          <span className="text-sm text-white font-medium">SOL</span>
                        </div>
                        <span className="ml-2 font-medium">Solana</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium mt-1">10 SOL</p>
                    </div>
                  </div>
                  
                  <div className="w-full flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">To</p>
                      <div className="flex items-center mt-1">
                        <div className="w-8 h-8 bg-[#627EEA] rounded-full flex items-center justify-center">
                          <span className="text-sm text-white font-medium">ETH</span>
                        </div>
                        <span className="ml-2 font-medium">Ethereum</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated time</p>
                      <p className="font-medium mt-1">~2 minutes</p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-nexus">
                    Bridge Tokens
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose <span className="gradient-text">Warpgate</span>?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                { step: '1', text: 'Connect your wallets across multiple chains' },
                { step: '2', text: 'Select source and destination chains' },
                { step: '3', text: 'Enter the amount and confirm your transaction' },
                { step: '4', text: 'LayerZero handles the cross-chain communication' },
                { step: '5', text: 'Receive your assets on the destination chain' }
              ].map((item, i) => (
                <div key={i} className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-grow pt-1">
                    <p className="text-lg">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                className="bg-gradient-nexus hover:opacity-90 transition-opacity text-white px-8"
                onClick={() => navigate('/bridge')}
                size="lg"
              >
                Try It Now
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-2xl bg-gradient-nexus p-[2px]">
          <div className="bg-card rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to explore the omnichain future?</h2>
              <p className="text-lg mb-8 text-muted-foreground">
                Start bridging assets and exploring the power of LayerZero V2 technology today.
              </p>
              <Button 
                className="bg-gradient-nexus hover:opacity-90 transition-opacity text-white px-8 py-6"
                onClick={() => navigate('/dashboard')}
                size="lg"
              >
                Launch App
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
