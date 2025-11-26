
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import PreventiveMaintenance from "./pages/PreventiveMaintenance";
import CorrectiveMaintenance from "./pages/CorrectiveMaintenance";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import Inventory from "./pages/Inventory";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto bg-background">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/preventive" element={<PreventiveMaintenance />} />
                <Route path="/corrective" element={<CorrectiveMaintenance />} />
                <Route path="/equipment" element={<Equipment />} />
                <Route path="/equipment/:id" element={<EquipmentDetail />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
