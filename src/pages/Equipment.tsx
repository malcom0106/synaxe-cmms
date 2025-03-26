
import React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Truck, 
  Filter,
  Clock,
  Calendar,
  FileText,
  Settings,
  ChevronRight,
  Search
} from 'lucide-react';

// Demo data for equipment
const equipmentList = [
  { 
    id: 'EQ001', 
    name: 'Oléoserveur 201', 
    type: 'Oléoserveur', 
    status: 'operational',
    lastMaintenance: '15/04/2023',
    nextMaintenance: '15/06/2023',
    location: 'Zone A'
  },
  { 
    id: 'EQ002', 
    name: 'Oléoserveur 202', 
    type: 'Oléoserveur', 
    status: 'maintenance_required',
    lastMaintenance: '10/03/2023',
    nextMaintenance: '10/05/2023',
    location: 'Zone A'
  },
  { 
    id: 'EQ003', 
    name: 'Oléoserveur 203', 
    type: 'Oléoserveur', 
    status: 'operational',
    lastMaintenance: '20/04/2023',
    nextMaintenance: '20/06/2023',
    location: 'Zone B'
  },
  { 
    id: 'EQ004', 
    name: 'Compteur Zone 1', 
    type: 'Compteur', 
    status: 'operational',
    lastMaintenance: '05/05/2023',
    nextMaintenance: '05/11/2023',
    location: 'Zone 1'
  },
  { 
    id: 'EQ005', 
    name: 'Citerne principale', 
    type: 'Citerne', 
    status: 'operational',
    lastMaintenance: '01/02/2023',
    nextMaintenance: '01/08/2023',
    location: 'Dépôt'
  },
];

const Equipment: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageTitle 
        title="Équipements et Infrastructures" 
        subtitle="Gérer et suivre les équipements"
        action={
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel équipement
          </Button>
        }
      />
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher un équipement..."
            className="h-10 w-full rounded-md border border-gray-200 pl-4 pr-10 text-sm focus:border-airfuel-primary focus:outline-none focus:ring-1 focus:ring-airfuel-primary"
          />
        </div>
        <Button variant="outline" size="sm" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="card-dashboard card-hover">
          <div className="flex justify-between mb-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Truck className="h-5 w-5 text-airfuel-primary" />
            </div>
            <StatusBadge status="info" label="5 équipements" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Oléoserveurs</h3>
          <p className="text-sm text-gray-500 mt-1">3 équipements</p>
        </div>
        <div className="card-dashboard card-hover">
          <div className="flex justify-between mb-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Settings className="h-5 w-5 text-airfuel-success" />
            </div>
            <StatusBadge status="success" label="Tous opérationnels" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Compteurs</h3>
          <p className="text-sm text-gray-500 mt-1">1 équipement</p>
        </div>
        <div className="card-dashboard card-hover">
          <div className="flex justify-between mb-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
            <StatusBadge status="success" label="Tous opérationnels" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Citerne</h3>
          <p className="text-sm text-gray-500 mt-1">1 équipement</p>
        </div>
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
                  Équipement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière maintenance
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
              {equipmentList.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {equipment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {equipment.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-gray-400" />
                      {equipment.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {equipment.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {equipment.lastMaintenance}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={equipment.status === 'operational' ? 'success' : 'warning'} 
                      label={equipment.status === 'operational' ? 'Opérationnel' : 'Maintenance requise'} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </Button>
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Scanner un équipement</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-700 mb-3">Scannez un code QR pour accéder rapidement aux informations d'un équipement</p>
          <Button className="btn-primary">
            Scanner un QR Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
