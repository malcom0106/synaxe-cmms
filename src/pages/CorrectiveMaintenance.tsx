
import React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  BarChart, 
  Clock, 
  Filter, 
  User,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

// Demo data for corrective maintenance requests
const maintenanceRequests = [
  { 
    id: 'DI001', 
    title: 'Fuite hydraulique oléoserveur', 
    requester: 'Jean Dupont', 
    equipment: 'Oléoserveur 202', 
    priority: 'high',
    status: 'in_progress',
    dateCreated: '10/05/2023',
    assignedTo: 'Pierre Martin'
  },
  { 
    id: 'DI002', 
    title: 'Panne système électrique', 
    requester: 'Marie Laurent', 
    equipment: 'Bâtiment principal', 
    priority: 'medium',
    status: 'pending',
    dateCreated: '12/05/2023',
    assignedTo: null
  },
  { 
    id: 'DI003', 
    title: 'Calibration défectueuse', 
    requester: 'Thomas Bernard', 
    equipment: 'Compteur Zone 3', 
    priority: 'low',
    status: 'completed',
    dateCreated: '05/05/2023',
    assignedTo: 'Sophie Renard'
  },
  { 
    id: 'DI004', 
    title: 'Remplacement joint torique', 
    requester: 'Philippe Dubois', 
    equipment: 'Oléoserveur 201', 
    priority: 'medium',
    status: 'in_progress',
    dateCreated: '08/05/2023',
    assignedTo: 'Pierre Martin'
  },
  { 
    id: 'DI005', 
    title: 'Panne pompe transfert', 
    requester: 'Isabelle Moreau', 
    equipment: 'Station pompage', 
    priority: 'high',
    status: 'pending',
    dateCreated: '13/05/2023',
    assignedTo: null
  },
];

const CorrectiveMaintenance: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageTitle 
        title="Maintenance Corrective" 
        subtitle="Gérer les demandes d'intervention"
        action={
          <div className="flex gap-2">
            <Button variant="outline">
              <BarChart className="h-4 w-4 mr-2" />
              Statistiques
            </Button>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </div>
        }
      />
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher une demande d'intervention..."
            className="h-10 w-full rounded-md border border-gray-200 pl-4 pr-10 text-sm focus:border-airfuel-primary focus:outline-none focus:ring-1 focus:ring-airfuel-primary"
          />
        </div>
        <Button variant="outline" size="sm" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="card-dashboard card-hover bg-gray-50">
          <h3 className="text-sm font-medium text-gray-500 mb-2">En attente</h3>
          <div className="text-2xl font-bold text-gray-900">2</div>
        </div>
        <div className="card-dashboard card-hover bg-blue-50">
          <h3 className="text-sm font-medium text-gray-500 mb-2">En cours</h3>
          <div className="text-2xl font-bold text-airfuel-primary">2</div>
        </div>
        <div className="card-dashboard card-hover bg-green-50">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Complétées</h3>
          <div className="text-2xl font-bold text-airfuel-success">1</div>
        </div>
        <div className="card-dashboard card-hover bg-red-50">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Priorité haute</h3>
          <div className="text-2xl font-bold text-airfuel-danger">2</div>
        </div>
      </div>
      
      <div className="mt-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Équipement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorité
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigné à
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
              {maintenanceRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.equipment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {request.dateCreated}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={
                        request.priority === 'high' ? 'danger' : 
                        request.priority === 'medium' ? 'warning' : 
                        'info'
                      } 
                      label={
                        request.priority === 'high' ? 'Haute' : 
                        request.priority === 'medium' ? 'Moyenne' : 
                        'Basse'
                      } 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.assignedTo ? (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {request.assignedTo}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Non assigné</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={
                        request.status === 'pending' ? 'warning' : 
                        request.status === 'in_progress' ? 'info' : 
                        'success'
                      } 
                      label={
                        request.status === 'pending' ? 'En attente' : 
                        request.status === 'in_progress' ? 'En cours' : 
                        'Terminé'
                      } 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm">
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
      
      <div className="mt-6">
        <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Intervention prioritaire</h4>
            <p className="text-xs text-yellow-700 mt-1">
              Les demandes d'intervention marquées comme prioritaires doivent être traitées en moins de 24 heures conformément aux procédures de sécurité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectiveMaintenance;
