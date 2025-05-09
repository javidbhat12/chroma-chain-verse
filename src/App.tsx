
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayerZeroProvider } from "./contexts/LayerZeroContext";
import Navbar from "./components/Navbar";

// Import pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Bridge from "./pages/Bridge";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LayerZeroProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bridge" element={<Bridge />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LayerZeroProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
