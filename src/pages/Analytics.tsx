
import { useState } from 'react';
import { ArrowLeft, Calendar, Wallet, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Mock data for the charts
const volumeData = [
  { name: 'May 1', SOL: 10, ETH: 5, AVA: 3 },
  { name: 'May 2', SOL: 12, ETH: 8, AVA: 2 },
  { name: 'May 3', SOL: 15, ETH: 10, AVA: 5 },
  { name: 'May 4', SOL: 8, ETH: 12, AVA: 8 },
  { name: 'May 5', SOL: 18, ETH: 15, AVA: 6 },
  { name: 'May 6', SOL: 24, ETH: 18, AVA: 9 },
  { name: 'May 7', SOL: 30, ETH: 24, AVA: 12 },
];

const transactionData = [
  { name: 'May 1', count: 42 },
  { name: 'May 2', count: 63 },
  { name: 'May 3', count: 58 },
  { name: 'May 4', count: 70 },
  { name: 'May 5', count: 85 },
  { name: 'May 6', count: 120 },
  { name: 'May 7', count: 140 },
];

const gasData = [
  { name: 'May 1', avgGas: 0.025 },
  { name: 'May 2', avgGas: 0.032 },
  { name: 'May 3', avgGas: 0.028 },
  { name: 'May 4', avgGas: 0.035 },
  { name: 'May 5', avgGas: 0.030 },
  { name: 'May 6', avgGas: 0.026 },
  { name: 'May 7', avgGas: 0.022 },
];

const routeData = [
  { name: 'Solana → Ethereum', value: 45 },
  { name: 'Ethereum → Solana', value: 35 },
  { name: 'Solana → Avalanche', value: 10 },
  { name: 'Avalanche → Solana', value: 5 },
  { name: 'Ethereum → Avalanche', value: 3 },
  { name: 'Other', value: 2 },
];

const COLORS = ['#8B5CF6', '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#6B7280'];

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded shadow">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('week');

  return (
    <div className="min-h-screen pt-16 pb-10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-2" onClick={() => history.back()}>
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-2xl font-bold">Analytics</h1>
          </div>

          <Select
            value={timeframe}
            onValueChange={(value) => setTimeframe(value)}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <SelectValue placeholder="Select timeframe" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 hours</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last month</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Volume (7d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24.8M</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +15.3% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transactions (7d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">578</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +8.2% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Transaction Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2m 18s</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                -0.3s from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Gas Fee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.028</div>
              <p className="text-xs text-red-500 flex items-center mt-1">
                +2.1% from last week
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <Tabs defaultValue="volume" className="space-y-4">
          <TabsList>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="gas">Gas</TabsTrigger>
          </TabsList>
          
          {/* Volume Chart */}
          <TabsContent value="volume">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Daily cross-chain transfer volume by chain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={volumeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="SOL" fill="#9945FF" name="Solana" />
                      <Bar dataKey="ETH" fill="#627EEA" name="Ethereum" />
                      <Bar dataKey="AVA" fill="#E84142" name="Avalanche" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transaction Chart */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Count</CardTitle>
                <CardDescription>Daily number of cross-chain transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={transactionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#8B5CF6" 
                        fill="url(#colorGradient)" 
                        name="Transactions"
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Routes Chart */}
          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle>Popular Routes</CardTitle>
                <CardDescription>Distribution of cross-chain transfer routes</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center justify-center">
                <div className="h-80 w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={routeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {routeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 mt-6 md:mt-0">
                  {routeData.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Gas Chart */}
          <TabsContent value="gas">
            <Card>
              <CardHeader>
                <CardTitle>Average Gas Fees</CardTitle>
                <CardDescription>Daily average gas fees for cross-chain transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={gasData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="avgGas" 
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                        name="Avg. Gas (ETH)"
                        dot={{ r: 4, fill: "#3B82F6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* LayerZero Stats */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">LayerZero V2 Network Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2" size={18} />
                  Total Value Locked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1.28B</div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">ETH</p>
                    <p className="font-medium">$512M</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">SOL</p>
                    <p className="font-medium">$284M</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Others</p>
                    <p className="font-medium">$484M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowRight className="mr-2" size={18} />
                  Network Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">842,156</div>
                <p className="text-sm text-muted-foreground mt-1">Total messages sent</p>
                
                <div className="mt-4">
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Messages (24h)</span>
                    <span className="font-medium">24,815</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-omni rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2" size={18} />
                  Network Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">99.98%</span>
                  <span className="text-sm text-muted-foreground ml-2">uptime</span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div>
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Solana Endpoint</span>
                      <span className="font-medium text-green-500">Operational</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Ethereum Endpoint</span>
                      <span className="font-medium text-green-500">Operational</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
