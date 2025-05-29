import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import { AgentContacts } from "./pages/AgentContacts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-gray-900">
              AI Agent Team
            </Link>
            <div className="flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/contacts" className="text-gray-700 hover:text-blue-600">
                Agent Contacts
              </Link>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contacts" element={<AgentContacts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
