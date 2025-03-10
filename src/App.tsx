
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import EmployeeSettings from "./pages/EmployeeSettings";
import EmployeeDirectory from "./pages/EmployeeDirectory";
import AdditionalWorkJournal from "./pages/AdditionalWorkJournal";
import TimeSheet from "./pages/TimeSheet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/employee-settings" element={<EmployeeSettings />} />
                <Route path="/employee-directory" element={<EmployeeDirectory />} />
                <Route path="/additional-work" element={<AdditionalWorkJournal />} />
                <Route path="/timesheet" element={<TimeSheet />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
