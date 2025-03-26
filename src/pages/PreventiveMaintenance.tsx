
import React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Plus, 
  ChevronRight, 
  FileText, 
  Clock,
  Filter,
  Truck
} from 'lucide-react';

// Demo data for maintenance plans
const maintenancePlans = [
  { 
    id: 'MP001', 
    title: 'Maintenance mensuelle oléoserveur', 
    equipment: 'Oléoserveur 201, 202, 203', 
    frequency: 'Mensuel', 
    nextDate: '15/06/2023',
    status: 'upcoming'
  },
  { 
    id: 'MP002', 
    title: 'Contrôle réglementaire extincteurs', 
    equipment: 'Bâtiment principal', 
    frequency: 'Semestriel', 
    nextDate: '10/07/2023',
    status: 'upcoming'
  },
  { 
    id: 'MP003', 
    title: 'Révision générale pompes', 
    equipment: 'Station de pompage', 
    frequency: 'Trimestriel', 
    nextDate: '28/05/2023',
    status: 'late'
  },
  { 
    id: 'MP004', 
    title: 'Calibration compteurs', 
    equipment: 'Zone refueling', 
    frequency: 'Annuel', 
    nextDate: '12/12/2023',
    status: 'upcoming'
  },
  { 
    id: 'MP005', 
    title: 'Inspection systèmes hydrauliques', 
    equipment: 'Oléoserveurs', 
    frequency: 'Mensuel', 
    nextDate: '05/06/2023',
    status: 'upcoming'
  },
];

const PreventiveMaintenance: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageTitle 
        title="Maintenance Préventive" 
        subtitle="Planifier et gérer les maintenances préventives"
        action={
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau plan
          </Button>
        }
      />
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher un plan de maintenance..."
            className="h-10 w-full rounded-md border border-gray-200 pl-4 pr-10 text-sm focus:border-airfuel-primary focus:outline-none focus:ring-1 focus:ring-airfuel-primary"
          />
        </div>
        <Button variant="outline" size="sm" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
        <Button variant="outline" size="sm" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Calendrier
        </Button>
      </div>
      
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Équipement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fréquence
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prochaine date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenancePlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plan.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-gray-400" />
                      {plan.equipment}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {plan.frequency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.nextDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={plan.status === 'late' ? 'danger' : 'success'} 
                      label={plan.status === 'late' ? 'En retard' : 'Planifié'} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu du calendrier</h3>
        <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Calendrier des maintenances préventives</p>
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Voir le calendrier complet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreventiveMaintenance;
