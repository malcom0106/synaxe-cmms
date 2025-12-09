
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance";
import PreventiveMaintenance from "./pages/PreventiveMaintenance";
import CorrectiveMaintenance from "./pages/CorrectiveMaintenance";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import Inventory from "./pages/Inventory";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import MaintenanceRanges from "./pages/MaintenanceRanges";
import MaintenanceRangeDetail from "./pages/MaintenanceRangeDetail";
import MaintenanceActions from "./pages/MaintenanceActions";
import MaintenanceActionDetail from "./pages/MaintenanceActionDetail";
import EquipmentFamilies from "./pages/EquipmentFamilies";
import EquipmentSubFamilies from "./pages/EquipmentSubFamilies";
import NotFound from "./pages/NotFound";

// Tablet pages
import { TabletLayout } from "./components/tablet/TabletLayout";
import TabletLogin from "./pages/tablet/TabletLogin";
import TabletDashboard from "./pages/tablet/TabletDashboard";
import TabletInterventionDetail from "./pages/tablet/TabletInterventionDetail";
import TabletMaintenanceRanges from "./pages/tablet/TabletMaintenanceRanges";
import TabletMaintenanceRangeDetail from "./pages/tablet/TabletMaintenanceRangeDetail";
import TabletMaintenancePlan from "./pages/tablet/TabletMaintenancePlan";
import TabletInterventionRequests from "./pages/tablet/TabletInterventionRequests";
import TabletDiagnostic from "./pages/tablet/TabletDiagnostic";
import TabletInventory from "./pages/tablet/TabletInventory";
import TabletHistory from "./pages/tablet/TabletHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Tablet routes */}
          <Route path="/tablet/login" element={<TabletLogin />} />
          <Route path="/tablet" element={<TabletLayout />}>
            <Route index element={<TabletDashboard />} />
            <Route path="intervention/:id" element={<TabletInterventionDetail />} />
            <Route path="ranges" element={<TabletMaintenanceRanges />} />
            <Route path="ranges/:id" element={<TabletMaintenanceRangeDetail />} />
            <Route path="plan" element={<TabletMaintenancePlan />} />
            <Route path="requests" element={<TabletInterventionRequests />} />
            <Route path="diagnostic" element={<TabletDiagnostic />} />
            <Route path="inventory" element={<TabletInventory />} />
            <Route path="history" element={<TabletHistory />} />
          </Route>

          {/* Desktop routes */}
          <Route path="/*" element={
            <div className="flex h-screen w-full overflow-hidden">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-auto bg-background">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/maintenance/ranges" element={<MaintenanceRanges />} />
                    <Route path="/maintenance/ranges/:id" element={<MaintenanceRangeDetail />} />
                    <Route path="/maintenance/actions" element={<MaintenanceActions />} />
                    <Route path="/maintenance/actions/:id" element={<MaintenanceActionDetail />} />
                    <Route path="/preventive" element={<PreventiveMaintenance />} />
                    <Route path="/corrective" element={<CorrectiveMaintenance />} />
                    <Route path="/equipment" element={<Equipment />} />
                    <Route path="/equipment/:id" element={<EquipmentDetail />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/equipment-families" element={<EquipmentFamilies />} />
                    <Route path="/settings/equipment-subfamilies" element={<EquipmentSubFamilies />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
