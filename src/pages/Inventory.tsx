
import React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Package, 
  Filter,
  ShoppingCart,
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Search
} from 'lucide-react';

// Demo data for inventory items
const inventoryItems = [
  { 
    id: 'PDR001', 
    name: 'Filtre à huile', 
    category: 'Filtres', 
    quantity: 5,
    minQuantity: 10,
    price: 75.50,
    location: 'Étagère A3',
    lastOrder: '10/04/2023',
    status: 'low'
  },
  { 
    id: 'PDR002', 
    name: 'Joint torique 50mm', 
    category: 'Joints', 
    quantity: 25,
    minQuantity: 15,
    price: 12.20,
    location: 'Tiroir B2',
    lastOrder: '15/03/2023',
    status: 'ok'
  },
  { 
    id: 'PDR003', 
    name: 'Tuyau hydraulique 1m', 
    category: 'Hydraulique', 
    quantity: 3,
    minQuantity: 5,
    price: 95.30,
    location: 'Étagère C1',
    lastOrder: '02/05/2023',
    status: 'low'
  },
  { 
    id: 'PDR004', 
    name: 'Filtre à air', 
    category: 'Filtres', 
    quantity: 12,
    minQuantity: 8,
    price: 45.75,
    location: 'Étagère A2',
    lastOrder: '20/04/2023',
    status: 'ok'
  },
  { 
    id: 'PDR005', 
    name: 'Kit de réparation pompe', 
    category: 'Pompes', 
    quantity: 2,
    minQuantity: 2,
    price: 185.00,
    location: 'Tiroir D4',
    lastOrder: '25/03/2023',
    status: 'warning'
  },
];

const Inventory: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageTitle 
        title="Stocks et Pièces de Rechange" 
        subtitle="Gérer l'inventaire des pièces détachées"
        action={
          <div className="flex gap-2">
            <Button variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Commander
            </Button>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle pièce
            </Button>
          </div>
        }
      />
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher une pièce..."
            className="h-10 w-full rounded-md border border-gray-200 pl-4 pr-10 text-sm focus:border-airfuel-primary focus:outline-none focus:ring-1 focus:ring-airfuel-primary"
          />
        </div>
        <Button variant="outline" size="sm" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
        <Button variant="outline" size="sm" className="flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Statistiques
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="card-dashboard card-hover">
          <div className="flex justify-between mb-3">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total des références</h3>
          <div className="text-2xl font-bold text-gray-900 mt-1">42</div>
        </div>
        <div className="card-dashboard card-hover">
          <div className="flex justify-between mb-3">
            <ShoppingCart className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-500">Valeur du stock</h3>
          <div className="text-2xl font-bold text-gray-900 mt-1">25 430 €</div>
        </div>
        <div className="card-dashboard card-hover">
          <div className="flex justify-between mb-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <StatusBadge status="warning" label="Attention" />
          </div>
          <h3 className="text-sm font-medium text-gray-500">Stock faible</h3>
          <div className="text-2xl font-bold text-yellow-600 mt-1">3</div>
        </div>
        <div className="card-dashboard card-hover">
          <div className="flex justify-between mb-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <StatusBadge status="danger" label="Critique" />
          </div>
          <h3 className="text-sm font-medium text-gray-500">Rupture de stock</h3>
          <div className="text-2xl font-bold text-red-600 mt-1">1</div>
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
                  Désignation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emplacement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix unitaire
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
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span className={
                        item.quantity < item.minQuantity 
                          ? 'font-medium text-airfuel-danger' 
                          : item.quantity === item.minQuantity
                            ? 'font-medium text-airfuel-warning'
                            : 'text-gray-900'
                      }>
                        {item.quantity}
                      </span>
                      <span className="text-gray-400 ml-1">/ {item.minQuantity} min</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.price.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={
                        item.status === 'ok' ? 'success' : 
                        item.status === 'warning' ? 'warning' : 
                        'danger'
                      } 
                      label={
                        item.status === 'ok' ? 'OK' : 
                        item.status === 'warning' ? 'Attention' : 
                        'Stock faible'
                      } 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ShoppingCart className="h-4 w-4 text-gray-500" />
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
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Scanner une pièce</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-700 mb-3">Scannez un code barre pour gérer le stock d'une pièce</p>
            <Button className="btn-primary">
              Scanner un code barre
            </Button>
          </div>
        </div>
        
        <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 mt-1" />
            <div>
              <h4 className="text-md font-medium text-yellow-800">Articles à réapprovisionner</h4>
              <p className="text-sm text-yellow-700 mt-2 mb-4">Les articles suivants ont atteint leur seuil minimal :</p>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm text-yellow-800">Filtre à huile</span>
                  <StatusBadge status="danger" label="5 / 10" />
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-yellow-800">Tuyau hydraulique 1m</span>
                  <StatusBadge status="danger" label="3 / 5" />
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-yellow-800">Kit de réparation pompe</span>
                  <StatusBadge status="warning" label="2 / 2" />
                </li>
              </ul>
              <div className="mt-4">
                <Button variant="outline" className="bg-white border-yellow-200 text-yellow-800 hover:bg-yellow-100">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Créer une demande d'achat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
