
import React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileText, 
  Filter,
  Download,
  Eye,
  Calendar,
  Search,
  File
} from 'lucide-react';

// Demo data for documents
const documents = [
  { 
    id: 'DOC001', 
    title: 'Manuel maintenance oléoserveur', 
    type: 'PDF', 
    category: 'Manuel',
    equipment: 'Oléoserveur',
    dateAdded: '15/01/2023',
    size: '8.5 MB',
    author: 'Service Technique'
  },
  { 
    id: 'DOC002', 
    title: 'Plan citerne principale', 
    type: 'DWG', 
    category: 'Schéma',
    equipment: 'Citerne',
    dateAdded: '03/02/2023',
    size: '12.2 MB',
    author: 'Bureau d\'Études'
  },
  { 
    id: 'DOC003', 
    title: 'Procédure calibration compteurs', 
    type: 'PDF', 
    category: 'Procédure',
    equipment: 'Compteurs',
    dateAdded: '22/03/2023',
    size: '1.3 MB',
    author: 'Qualité'
  },
  { 
    id: 'DOC004', 
    title: 'Check-list maintenance mensuelle', 
    type: 'XLSX', 
    category: 'Check-list',
    equipment: 'Tous',
    dateAdded: '10/04/2023',
    size: '245 KB',
    author: 'Service Maintenance'
  },
  { 
    id: 'DOC005', 
    title: 'Rapport inspection sécurité Q1', 
    type: 'PDF', 
    category: 'Rapport',
    equipment: 'Installation',
    dateAdded: '15/04/2023',
    size: '3.8 MB',
    author: 'HSSE'
  },
];

// Document categories
const categories = [
  { name: 'Tous', count: 42 },
  { name: 'Manuels', count: 12 },
  { name: 'Procédures', count: 15 },
  { name: 'Check-lists', count: 8 },
  { name: 'Rapports', count: 5 },
  { name: 'Schémas', count: 2 },
];

const Documents: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageTitle 
        title="Gestion Documentaire" 
        subtitle="Gérer et organiser les documents techniques"
        action={
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau document
          </Button>
        }
      />
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher un document..."
            className="h-10 w-full rounded-md border border-gray-200 pl-4 pr-10 text-sm focus:border-airfuel-primary focus:outline-none focus:ring-1 focus:ring-airfuel-primary"
          />
          <Search className="absolute right-3 top-[10px] h-5 w-5 text-gray-400" />
        </div>
        <Button variant="outline" size="sm" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Catégories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div 
                  key={category.name} 
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                >
                  <span className={category.name === 'Tous' ? 'font-medium text-airfuel-primary' : ''}>
                    {category.name}
                  </span>
                  <span className="text-gray-400 text-xs">{category.count}</span>
                </div>
              ))}
            </div>
            
            <h3 className="text-sm font-medium text-gray-500 mt-6 mb-3">Équipements</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                <span>Oléoserveurs</span>
                <span className="text-gray-400 text-xs">15</span>
              </div>
              <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                <span>Citerne</span>
                <span className="text-gray-400 text-xs">8</span>
              </div>
              <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                <span>Compteurs</span>
                <span className="text-gray-400 text-xs">6</span>
              </div>
              <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                <span>Installation</span>
                <span className="text-gray-400 text-xs">13</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Équipement
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taille
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                            <div className="text-xs text-gray-500">{doc.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusBadge 
                            status={
                              doc.category === 'Procédure' ? 'info' : 
                              doc.category === 'Manuel' ? 'warning' : 
                              doc.category === 'Rapport' ? 'danger' : 
                              'neutral'
                            } 
                            label={doc.category} 
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.equipment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {doc.dateAdded}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Eye className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Download className="h-4 w-4 text-gray-500" />
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Charger un nouveau document</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <File className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 mb-4">Déposez ici vos fichiers ou cliquez pour parcourir</p>
              <Button className="btn-primary">
                Parcourir
              </Button>
              <p className="text-xs text-gray-400 mt-4">Formats acceptés: PDF, DOCX, XLSX, JPG, PNG, DWG (max 20MB)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
