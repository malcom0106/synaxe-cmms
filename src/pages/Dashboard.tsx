
import React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { SimpleBarChart, SimplePieChart } from '@/components/dashboard/KPIChart';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, AlertTriangle, Calendar, Clock, Tool, Truck, Package,
  Activity, BarChart3, Settings 
} from 'lucide-react';

// Demo data
const maintenanceData = [
  { name: 'Jan', value: 12 },
  { name: 'Fév', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Avr', value: 21 },
  { name: 'Mai', value: 18 },
  { name: 'Juin', value: 25 },
];

const maintenanceTypeData = [
  { name: 'Préventive', value: 65, color: '#0070F3' },
  { name: 'Corrective', value: 35, color: '#EF4444' },
];

const recentAlerts = [
  { id: 1, title: 'Stock faible: Filtre à huile', level: 'warning', time: 'Il y a 2h' },
  { id: 2, title: 'Maintenance dépassée: Oléoserveur 202', level: 'danger', time: 'Il y a 5h' },
  { id: 3, title: 'Demande d\'intervention: Fuite hydraulique', level: 'info', time: 'Il y a 8h' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageTitle 
        title="Tableau de bord" 
        subtitle="Vue d'ensemble de la maintenance"
        action={
          <Button className="btn-primary">
            <span className="mr-2">Rapports</span>
            <BarChart3 className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Taux de disponibilité" 
          value="92%" 
          trend={{ value: 3, isPositive: true }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <DashboardCard 
          title="Interventions en cours" 
          value="8" 
          icon={<Tool className="h-5 w-5" />}
        />
        <DashboardCard 
          title="Maintenances planifiées" 
          value="12" 
          icon={<Calendar className="h-5 w-5" />}
        />
        <DashboardCard 
          title="Incidents de sécurité" 
          value="2" 
          trend={{ value: 1, isPositive: false }}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card-dashboard card-hover col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Interventions par mois</h3>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Filtrer
            </Button>
          </div>
          <SimpleBarChart 
            data={maintenanceData} 
            dataKey="value" 
            height={250}
          />
        </div>
        
        <div className="card-dashboard card-hover">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Types de maintenance</h3>
          <SimplePieChart data={maintenanceTypeData} height={200} />
          <div className="mt-4 flex justify-center gap-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-airfuel-primary mr-2"></div>
              <span className="text-xs text-gray-500">Préventive</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-airfuel-danger mr-2"></div>
              <span className="text-xs text-gray-500">Corrective</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card-dashboard card-hover">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Alertes récentes</h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="mt-0.5">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.level === 'danger' ? 'text-airfuel-danger' : 
                    alert.level === 'warning' ? 'text-airfuel-warning' : 
                    'text-airfuel-primary'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <StatusBadge 
                      status={alert.level as 'warning' | 'danger' | 'info'} 
                      label={
                        alert.level === 'danger' ? 'Urgent' : 
                        alert.level === 'warning' ? 'Attention' : 
                        'Information'
                      } 
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="link" className="text-sm text-airfuel-primary">
              Voir toutes les alertes
            </Button>
          </div>
        </div>
        
        <div className="card-dashboard card-hover">
          <h3 className="text-sm font-medium text-gray-500 mb-4">État des oléoserveurs</h3>
          <div className="space-y-3">
            {[201, 202, 203, 204].map((id) => (
              <div key={id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Oléoserveur {id}</p>
                    <p className="text-xs text-gray-500">Dernière maintenance: 12/05/2023</p>
                  </div>
                </div>
                <StatusBadge 
                  status={id === 202 ? 'warning' : 'success'} 
                  label={id === 202 ? 'Maintenance requise' : 'Opérationnel'} 
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" className="text-xs">
              <Truck className="h-3 w-3 mr-1" />
              Voir tous les équipements
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
