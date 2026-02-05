import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Filter,
  AlertTriangle,
  Search,
  ClipboardCheck,
  Calendar,
  Boxes,
  BarChart3,
  Eye
} from 'lucide-react';
import { InventoryCountModal } from '@/components/inventory/InventoryCountModal';
import { useToast } from '@/hooks/use-toast';

// Demo inventory history
const demoInventoryHistory = [
  { id: 'INV001', date: '20/01/2026', status: 'completed' as const, operator: 'J. Martin', totalItems: 45, differences: 3, notes: 'Inventaire trimestriel Q1' },
  { id: 'INV002', date: '15/10/2025', status: 'completed' as const, operator: 'A. Dupont', totalItems: 42, differences: 5, notes: 'Inventaire trimestriel Q4' },
  { id: 'INV003', date: '12/07/2025', status: 'completed' as const, operator: 'P. Bernard', totalItems: 40, differences: 2, notes: 'Inventaire semestriel' },
  { id: 'INV004', date: '05/04/2025', status: 'completed' as const, operator: 'J. Martin', totalItems: 38, differences: 8, notes: 'Inventaire annuel' },
];

// Demo parts for inventory modal
const demoParts = [
  { id: 'PDR001', name: 'Filtre à huile', location: 'Étagère A3', quantity: 5, warehouse: 'Magasin Principal' },
  { id: 'PDR002', name: 'Joint torique 50mm', location: 'Tiroir B2', quantity: 25, warehouse: 'Magasin Principal' },
  { id: 'PDR003', name: 'Tuyau hydraulique 1m', location: 'Étagère C1', quantity: 3, warehouse: 'Magasin Principal' },
  { id: 'PDR004', name: 'Filtre à air', location: 'Étagère A2', quantity: 12, warehouse: 'Magasin Principal' },
  { id: 'PDR005', name: 'Kit de réparation pompe', location: 'Tiroir D4', quantity: 2, warehouse: 'Magasin Secondaire' },
];

const InventoryCounts: React.FC = () => {
  const { toast } = useToast();
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = demoInventoryHistory.filter(inv =>
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInventoryCount = (data: { lines: Array<{ partId: string; actualQty: number | null }> }) => {
    toast({ 
      title: "Inventaire enregistré", 
      description: `${data.lines.filter(l => l.actualQty !== null).length} article(s) comptés.` 
    });
  };

  const totalDifferences = demoInventoryHistory.reduce((sum, inv) => sum + inv.differences, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageTitle 
        title="Inventaires" 
        subtitle="Historique et gestion des inventaires"
        action={
          <Button className="btn-primary" onClick={() => setInventoryModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel inventaire
          </Button>
        }
      />

      {/* Search and filters */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un inventaire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="card-dashboard card-hover">
          <ClipboardCheck className="h-6 w-6 text-muted-foreground mb-3" />
          <h3 className="text-sm font-medium text-muted-foreground">Total inventaires</h3>
          <div className="text-2xl font-bold text-foreground mt-1">{demoInventoryHistory.length}</div>
        </div>
        <div className="card-dashboard card-hover">
          <Calendar className="h-6 w-6 text-muted-foreground mb-3" />
          <h3 className="text-sm font-medium text-muted-foreground">Dernier inventaire</h3>
          <div className="text-2xl font-bold text-foreground mt-1">{demoInventoryHistory[0]?.date || '-'}</div>
        </div>
        <div className="card-dashboard card-hover">
          <Boxes className="h-6 w-6 text-muted-foreground mb-3" />
          <h3 className="text-sm font-medium text-muted-foreground">Articles comptés (dernier)</h3>
          <div className="text-2xl font-bold text-foreground mt-1">{demoInventoryHistory[0]?.totalItems || 0}</div>
        </div>
        <div className="card-dashboard card-hover">
          <div className="flex justify-between mb-3">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Écarts totaux</h3>
          <div className="text-2xl font-bold text-warning mt-1">{totalDifferences}</div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-32">Référence</TableHead>
                <TableHead className="w-32">Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-40">Opérateur</TableHead>
                <TableHead className="w-32 text-center">Articles</TableHead>
                <TableHead className="w-32 text-center">Écarts</TableHead>
                <TableHead className="w-24">Statut</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">{inv.id}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{inv.date}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{inv.notes}</span>
                  </TableCell>
                  <TableCell className="text-sm">{inv.operator}</TableCell>
                  <TableCell className="text-center font-medium">{inv.totalItems}</TableCell>
                  <TableCell className="text-center">
                    {inv.differences > 0 ? (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                        {inv.differences} écart(s)
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                        Aucun
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status="success" label="Terminé" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Voir détails">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Exporter">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <ClipboardCheck className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Aucun inventaire trouvé</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Info section */}
      <div className="mt-6 rounded-xl border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ClipboardCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Réaliser un inventaire</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Un inventaire permet de comparer les quantités théoriques du système avec les quantités réelles en stock. 
              Les écarts détectés peuvent être validés avec une justification obligatoire au-delà de 10%.
            </p>
            <Button className="btn-primary" onClick={() => setInventoryModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Démarrer un inventaire
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <InventoryCountModal
        open={inventoryModalOpen}
        onOpenChange={setInventoryModalOpen}
        onConfirm={handleInventoryCount}
        parts={demoParts}
      />
    </div>
  );
};

export default InventoryCounts;
