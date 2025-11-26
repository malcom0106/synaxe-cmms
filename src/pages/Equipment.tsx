
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Truck, 
  Clock,
  Edit,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  referenceExterne: string;
  type: string;
  lastMaintenance: string;
  statut: 'Opérationnel' | 'Maintenance';
  etat: 'Actif' | 'Inactif';
}

const initialEquipmentList: Equipment[] = [
  { 
    id: '202', 
    name: '202', 
    referenceExterne: 'camion 202 oléo',
    type: 'Oléoserveur', 
    lastMaintenance: '26/11/2025',
    statut: 'Opérationnel',
    etat: 'Actif'
  },
  { 
    id: '215', 
    name: '215', 
    referenceExterne: 'camion 215 Citerne',
    type: 'Citerne', 
    lastMaintenance: '26/11/2025',
    statut: 'Opérationnel',
    etat: 'Actif'
  },
  { 
    id: 'Cuve 108', 
    name: 'Cuve 108', 
    referenceExterne: 'cuve banc de test',
    type: 'Cuve', 
    lastMaintenance: '26/11/2025',
    statut: 'Opérationnel',
    etat: 'Actif'
  },
];

const Equipment: React.FC = () => {
  const navigate = useNavigate();
  const [equipmentList] = useState<Equipment[]>(initialEquipmentList);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(equipmentList.length / itemsPerPage);

  return (
    <div className="p-6 w-full bg-background">
      <PageTitle 
        title="Équipements" 
        subtitle="Gestion du parc d'équipements"
        action={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel équipement
          </Button>
        }
      />
      
      {/* Barre de recherche */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un équipement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Select>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Filtrer par famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="famille1">Famille 1</SelectItem>
            <SelectItem value="famille2">Famille 2</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Filtrer par sous-famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sous-famille1">Sous-famille 1</SelectItem>
            <SelectItem value="sous-famille2">Sous-famille 2</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Filtrer par parent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="parent1">Parent 1</SelectItem>
            <SelectItem value="parent2">Parent 2</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operationnel">Opérationnel</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Filtrer par état" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="actif">Actif</SelectItem>
            <SelectItem value="inactif">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Tableau */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Nom
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Référence externe
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Dernière maintenance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  État
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {equipmentList.map((equipment) => (
                <tr 
                  key={equipment.id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/equipment/${equipment.id}`)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {equipment.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {equipment.referenceExterne}
                  </td>
                  <td className="px-4 py-3 text-sm text-primary">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      {equipment.type}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {equipment.lastMaintenance}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {equipment.statut}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {equipment.etat}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Par page</span>
          <Select value={String(itemsPerPage)} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="h-8 w-16">
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
          Affichage de 1-{equipmentList.length} sur {equipmentList.length} équipement(s)
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
