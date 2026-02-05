import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

interface PartSubFamily {
  id: number;
  label: string;
  parentFamily: string;
  createdAt: string;
  lastModified: string;
}

const families = ['Filtres', 'Joints', 'Lubrifiants', 'Courroies', 'Roulements', 'Capteurs', 'Flexibles', 'Électrique', 'Pompes', 'Hydraulique'];

const initialSubFamilies: PartSubFamily[] = [
  { id: 1, label: 'Huile', parentFamily: 'Filtres', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 2, label: 'Air', parentFamily: 'Filtres', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 3, label: 'Carburant', parentFamily: 'Filtres', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 4, label: 'Hydraulique', parentFamily: 'Filtres', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 5, label: 'Toriques', parentFamily: 'Joints', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 6, label: 'Plats', parentFamily: 'Joints', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 7, label: 'SPI', parentFamily: 'Joints', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 8, label: 'Mécaniques', parentFamily: 'Joints', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 9, label: 'Huiles', parentFamily: 'Lubrifiants', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 10, label: 'Graisses', parentFamily: 'Lubrifiants', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 11, label: 'Tuyaux', parentFamily: 'Hydraulique', createdAt: '26/11/2025', lastModified: '26/11/2025' },
  { id: 12, label: 'Raccords', parentFamily: 'Hydraulique', createdAt: '26/11/2025', lastModified: '26/11/2025' },
];

const PartSubFamilies: React.FC = () => {
  const { toast } = useToast();
  const [subFamilies, setSubFamilies] = useState<PartSubFamily[]>(initialSubFamilies);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFamily, setFilterFamily] = useState<string>('all');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubFamily, setEditingSubFamily] = useState<PartSubFamily | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formParentFamily, setFormParentFamily] = useState('');

  const filteredSubFamilies = subFamilies.filter(sf => {
    const matchesSearch = sf.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sf.parentFamily.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterFamily === 'all' || sf.parentFamily === filterFamily;
    return matchesSearch && matchesFilter;
  });

  const totalItems = filteredSubFamilies.length;
  const currentPage = 1;
  const totalPages = 1;

  const handleOpenModal = (subFamily?: PartSubFamily) => {
    if (subFamily) {
      setEditingSubFamily(subFamily);
      setFormLabel(subFamily.label);
      setFormParentFamily(subFamily.parentFamily);
    } else {
      setEditingSubFamily(null);
      setFormLabel('');
      setFormParentFamily('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const today = new Date().toLocaleDateString('fr-FR');
    
    if (editingSubFamily) {
      setSubFamilies(subFamilies.map(sf => 
        sf.id === editingSubFamily.id 
          ? { ...sf, label: formLabel, parentFamily: formParentFamily, lastModified: today }
          : sf
      ));
      toast({ title: "Sous-famille modifiée", description: `La sous-famille "${formLabel}" a été mise à jour.` });
    } else {
      const newSubFamily: PartSubFamily = {
        id: Math.max(...subFamilies.map(sf => sf.id)) + 1,
        label: formLabel,
        parentFamily: formParentFamily,
        createdAt: today,
        lastModified: today,
      };
      setSubFamilies([...subFamilies, newSubFamily]);
      toast({ title: "Sous-famille créée", description: `La sous-famille "${formLabel}" a été créée.` });
    }
    
    setIsModalOpen(false);
    setFormLabel('');
    setFormParentFamily('');
    setEditingSubFamily(null);
  };

  return (
    <div className="p-6 w-full bg-background">
      <PageTitle
        title="Sous-Familles de Pièces" 
        subtitle="Gérer les sous-familles de pièces"
        action={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle sous-famille
          </Button>
        }
      />
      
      {/* Barre de recherche et filtre */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une sous-famille..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <Select value={filterFamily} onValueChange={setFilterFamily}>
          <SelectTrigger className="w-[200px] bg-card">
            <SelectValue placeholder="Filtrer par famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les familles</SelectItem>
            {families.map(f => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Libellé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Famille parente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date de création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Dernière modification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {filteredSubFamilies.map((subFamily) => (
                <tr key={subFamily.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">{subFamily.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{subFamily.label}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{subFamily.parentFamily}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{subFamily.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{subFamily.lastModified}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenModal(subFamily)}>
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
            Affichage de 1-{totalItems} sur {totalItems} sous-familles
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
              {editingSubFamily ? 'Modifier la sous-famille' : 'Nouvelle sous-famille de pièces'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parentFamily">Famille parente *</Label>
              <Select value={formParentFamily} onValueChange={setFormParentFamily}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une famille" />
                </SelectTrigger>
                <SelectContent>
                  {families.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Libellé *</Label>
              <Input
                id="label"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                placeholder="Nom de la sous-famille"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!formLabel.trim() || !formParentFamily}>
              {editingSubFamily ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartSubFamilies;
