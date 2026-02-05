import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search,
  Edit,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PartFamily {
  id: number;
  label: string;
  createdAt: string;
  lastModified: string;
}

const initialFamilies: PartFamily[] = [
  { id: 1, label: 'Filtres', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 2, label: 'Joints', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 3, label: 'Lubrifiants', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 4, label: 'Courroies', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 5, label: 'Roulements', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 6, label: 'Capteurs', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 7, label: 'Flexibles', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 8, label: 'Électrique', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 9, label: 'Pompes', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 10, label: 'Hydraulique', createdAt: '26/11/2025', lastModified: '26/11/2025' },
];

const PartFamilies: React.FC = () => {
  const { toast } = useToast();
  const [families, setFamilies] = useState<PartFamily[]>(initialFamilies);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<PartFamily | null>(null);
  const [formLabel, setFormLabel] = useState('');

  const filteredFamilies = families.filter(f => 
    f.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredFamilies.length;
  const currentPage = 1;
  const totalPages = 1;

  const handleOpenModal = (family?: PartFamily) => {
    if (family) {
      setEditingFamily(family);
      setFormLabel(family.label);
    } else {
      setEditingFamily(null);
      setFormLabel('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const today = new Date().toLocaleDateString('fr-FR');
    
    if (editingFamily) {
      setFamilies(families.map(f => 
        f.id === editingFamily.id 
          ? { ...f, label: formLabel, lastModified: today }
          : f
      ));
      toast({ title: "Famille modifiée", description: `La famille "${formLabel}" a été mise à jour.` });
    } else {
      const newFamily: PartFamily = {
        id: Math.max(...families.map(f => f.id)) + 1,
        label: formLabel,
        createdAt: today,
        lastModified: today,
      };
      setFamilies([...families, newFamily]);
      toast({ title: "Famille créée", description: `La famille "${formLabel}" a été créée.` });
    }
    
    setIsModalOpen(false);
    setFormLabel('');
    setEditingFamily(null);
  };

  return (
    <div className="p-6 w-full bg-background">
      <PageTitle
        title="Familles de Pièces" 
        subtitle="Gérer les familles de pièces"
        action={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleOpenModal()}>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Libellé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date de création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Dernière modification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {filteredFamilies.map((family) => (
                <tr key={family.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">{family.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{family.label}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{family.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{family.lastModified}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenModal(family)}>
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
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-foreground">Page {currentPage} sur {totalPages}</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {editingFamily ? 'Modifier la famille' : 'Nouvelle famille de pièces'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Libellé *</Label>
              <Input
                id="label"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                placeholder="Nom de la famille"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!formLabel.trim()}>
              {editingFamily ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartFamilies;
