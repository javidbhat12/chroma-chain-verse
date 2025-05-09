
import { useState } from 'react';
import { ArrowLeft, Search, CheckCircle, Clock, XCircle, ExternalLink, Filter } from 'lucide-react';
import { useLayerZero } from '@/contexts/LayerZeroContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StatusFilter = 'all' | 'completed' | 'pending' | 'failed';
type ChainFilter = 'all' | 'solana' | 'ethereum' | 'avalanche' | 'polygon' | 'bnb';

const History = () => {
  const { transactions } = useLayerZero();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [chainFilter, setChainFilter] = useState<ChainFilter>('all');

  // Format timestamp
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(tx => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      tx.hash.toLowerCase().includes(searchLower) ||
      tx.sourceChain.toLowerCase().includes(searchLower) ||
      tx.destinationChain.toLowerCase().includes(searchLower) ||
      tx.amount.toLowerCase().includes(searchLower);
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    
    // Chain filter
    const matchesChain = 
      chainFilter === 'all' || 
      tx.sourceChain === chainFilter || 
      tx.destinationChain === chainFilter;
    
    return matchesSearch && matchesStatus && matchesChain;
  });

  return (
    <div className="min-h-screen pt-16 pb-10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="mr-2" onClick={() => history.back()}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">Transaction History</h1>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={chainFilter}
              onValueChange={(value) => setChainFilter(value as ChainFilter)}
            >
              <SelectTrigger className="w-[160px]">
                <div className="flex items-center">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Chain" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="avalanche">Avalanche</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="bnb">BNB Chain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>From → To</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Hash</TableHead>
                <TableHead className="hidden md:table-cell">Time</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {tx.status === 'completed' ? (
                          <CheckCircle size={16} className="mr-2 text-green-500" />
                        ) : tx.status === 'pending' ? (
                          <Clock size={16} className="mr-2 text-yellow-500" />
                        ) : (
                          <XCircle size={16} className="mr-2 text-red-500" />
                        )}
                        <span className="capitalize hidden md:inline">{tx.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="capitalize">{tx.sourceChain}</span>
                        <span className="mx-2">→</span>
                        <span className="capitalize">{tx.destinationChain}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">
                      {tx.hash}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(tx.timestamp)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(`https://layerzeroscan.com/tx/${tx.hash}`, '_blank')}
                      >
                        <ExternalLink size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {transactions.length === 0 ? (
                      <div className="text-muted-foreground">
                        <p>No transactions yet</p>
                        <p className="text-sm">Your cross-chain transaction history will appear here</p>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        <p>No results found</p>
                        <p className="text-sm">Try changing your search or filters</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6">
          <div className="flex items-center">
            <CheckCircle size={16} className="mr-2 text-green-500" />
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-yellow-500" />
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center">
            <XCircle size={16} className="mr-2 text-red-500" />
            <span className="text-sm">Failed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
