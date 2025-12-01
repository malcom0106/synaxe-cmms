import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search,
  Edit,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface EquipmentFamily {
  id: number;
  label: string;
  createdAt: string;
  lastModified: string;
}

const equipmentFamilies: EquipmentFamily[] = [
  {
    id: 3,
    label: 'Cuve',
    createdAt: '26/11/2025',
    lastModified: '26/11/2025'
  },
  {
    id: 1,
    label: 'Camion',
    createdAt: '26/11/2025',
    lastModified: '26/11/2025'
  },
  {
    id: 2,
    label: 'Escabeau',
    createdAt: '26/11/2025',
    lastModified: '26/11/2025'
  },
];

const EquipmentFamilies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState('10');

  const totalItems = equipmentFamilies.length;
  const currentPage = 1;
  const totalPages = 1;

  return (
    <div className="p-6 w-full bg-background">
      {/* Back Link */}
      <Link 
        to="/settings" 
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux paramètres
      </Link>

      <PageTitle 
        title="Familles d'Équipements" 
        subtitle="Gérer les familles d'équipements"
        action={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle famille
          </Button>
        }
      />
      
      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une famille..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Libellé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Dernière modification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {equipmentFamilies.map((family) => (
                <tr 
                  key={family.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-foreground">
                    {family.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {family.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {family.createdAt}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {family.lastModified}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4 text-primary" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Par page</span>
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger className="w-[70px] h-8 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Affichage de 1-{totalItems} sur {totalItems} familles
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-foreground">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentFamilies;
