import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layers, 
  Warehouse, 
  MapPin,
  Check,
  X,
  Search,
  FolderTree
} from 'lucide-react';

interface CreateInventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selection: InventoryScope) => void;
  families: string[];
  subFamilies: Record<string, string[]>;
  warehouses: string[];
  locations: string[];
}

export interface InventoryScope {
  type: 'combined';
  families: string[];
  subFamilies: string[];
  warehouses: string[];
  locations: string[];
}

export const CreateInventoryModal: React.FC<CreateInventoryModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  families,
  subFamilies,
  warehouses,
  locations,
}) => {
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedSubFamilies, setSelectedSubFamilies] = useState<string[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Search states
  const [familySearch, setFamilySearch] = useState('');
  const [subFamilySearch, setSubFamilySearch] = useState('');
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  // Filtered lists based on search
  const filteredFamilies = useMemo(() => 
    families.filter(f => f.toLowerCase().includes(familySearch.toLowerCase())),
    [families, familySearch]
  );

  const allSubFamilies = useMemo(() => {
    const result: { subFamily: string; family: string }[] = [];
    Object.entries(subFamilies).forEach(([family, subs]) => {
      subs.forEach(sf => result.push({ subFamily: sf, family }));
    });
    return result;
  }, [subFamilies]);

  const filteredSubFamilies = useMemo(() => 
    allSubFamilies.filter(sf => 
      sf.subFamily.toLowerCase().includes(subFamilySearch.toLowerCase())
    ),
    [allSubFamilies, subFamilySearch]
  );

  const filteredWarehouses = useMemo(() => 
    warehouses.filter(w => w.toLowerCase().includes(warehouseSearch.toLowerCase())),
    [warehouses, warehouseSearch]
  );

  const filteredLocations = useMemo(() => 
    locations.filter(l => l.toLowerCase().includes(locationSearch.toLowerCase())),
    [locations, locationSearch]
  );

  const handleReset = () => {
    setSelectedFamilies([]);
    setSelectedSubFamilies([]);
    setSelectedWarehouses([]);
    setSelectedLocations([]);
    setFamilySearch('');
    setSubFamilySearch('');
    setWarehouseSearch('');
    setLocationSearch('');
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm({
      type: 'combined',
      families: selectedFamilies,
      subFamilies: selectedSubFamilies,
      warehouses: selectedWarehouses,
      locations: selectedLocations,
    });
    handleReset();
    onOpenChange(false);
  };

  const toggleFamily = (family: string) => {
    if (selectedFamilies.includes(family)) {
      setSelectedFamilies(selectedFamilies.filter(f => f !== family));
    } else {
      setSelectedFamilies([...selectedFamilies, family]);
    }
  };

  const toggleSubFamily = (subFamily: string) => {
    if (selectedSubFamilies.includes(subFamily)) {
      setSelectedSubFamilies(selectedSubFamilies.filter(sf => sf !== subFamily));
    } else {
      setSelectedSubFamilies([...selectedSubFamilies, subFamily]);
    }
  };

  const toggleWarehouse = (warehouse: string) => {
    if (selectedWarehouses.includes(warehouse)) {
      setSelectedWarehouses(selectedWarehouses.filter(w => w !== warehouse));
    } else {
      setSelectedWarehouses([...selectedWarehouses, warehouse]);
    }
  };

  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const getSelectionCount = () => {
    return selectedFamilies.length + selectedSubFamilies.length + selectedWarehouses.length + selectedLocations.length;
  };

  const isValid = getSelectionCount() > 0;

  const renderSearchableSection = (
    title: string,
    icon: React.ReactNode,
    searchValue: string,
    onSearchChange: (value: string) => void,
    items: string[],
    selectedItems: string[],
    onToggle: (item: string) => void,
    emptyMessage: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <Label className="text-sm font-medium">{title}</Label>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Rechercher ${title.toLowerCase()}...`}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9"
        />
      </div>
      <ScrollArea className="h-[100px] border rounded-md p-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">{emptyMessage}</p>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <div 
                key={item} 
                className="flex items-center space-x-2 p-1.5 rounded hover:bg-muted/50 cursor-pointer"
                onClick={() => onToggle(item)}
              >
                <Checkbox
                  id={`item-${item}`}
                  checked={selectedItems.includes(item)}
                  onCheckedChange={() => onToggle(item)}
                />
                <label
                  htmlFor={`item-${item}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {item}
                </label>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvel inventaire</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Label className="text-sm text-muted-foreground mb-4 block">
            Sélectionnez le périmètre de l'inventaire. Vous pouvez combiner plusieurs critères (familles, sous-familles, magasins, emplacements).
          </Label>

          <div className="grid grid-cols-2 gap-4">
            {/* Families */}
            {renderSearchableSection(
              'Familles',
              <Layers className="h-4 w-4 text-muted-foreground" />,
              familySearch,
              setFamilySearch,
              filteredFamilies,
              selectedFamilies,
              toggleFamily,
              'Aucune famille trouvée'
            )}

            {/* Sub-families */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FolderTree className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Sous-familles</Label>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher sous-familles..."
                  value={subFamilySearch}
                  onChange={(e) => setSubFamilySearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <ScrollArea className="h-[100px] border rounded-md p-2">
                {filteredSubFamilies.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">Aucune sous-famille trouvée</p>
                ) : (
                  <div className="space-y-1">
                    {filteredSubFamilies.map(({ subFamily, family }) => (
                      <div 
                        key={`${family}-${subFamily}`} 
                        className="flex items-center space-x-2 p-1.5 rounded hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleSubFamily(subFamily)}
                      >
                        <Checkbox
                          id={`sf-${family}-${subFamily}`}
                          checked={selectedSubFamilies.includes(subFamily)}
                          onCheckedChange={() => toggleSubFamily(subFamily)}
                        />
                        <label
                          htmlFor={`sf-${family}-${subFamily}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {subFamily}
                          <span className="text-xs text-muted-foreground ml-1">({family})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Warehouses */}
            {renderSearchableSection(
              'Magasins',
              <Warehouse className="h-4 w-4 text-muted-foreground" />,
              warehouseSearch,
              setWarehouseSearch,
              filteredWarehouses,
              selectedWarehouses,
              toggleWarehouse,
              'Aucun magasin trouvé'
            )}

            {/* Locations */}
            {renderSearchableSection(
              'Emplacements',
              <MapPin className="h-4 w-4 text-muted-foreground" />,
              locationSearch,
              setLocationSearch,
              filteredLocations,
              selectedLocations,
              toggleLocation,
              'Aucun emplacement trouvé'
            )}
          </div>

          {/* Selection summary */}
          {getSelectionCount() > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sélection ({getSelectionCount()} critère{getSelectionCount() > 1 ? 's' : ''})</span>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-6 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Effacer tout
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedFamilies.map(f => (
                  <Badge key={f} variant="secondary" className="text-xs gap-1">
                    <Layers className="h-3 w-3" />
                    {f}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => toggleFamily(f)}
                    />
                  </Badge>
                ))}
                {selectedSubFamilies.map(sf => (
                  <Badge key={sf} variant="outline" className="text-xs gap-1">
                    <FolderTree className="h-3 w-3" />
                    {sf}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => toggleSubFamily(sf)}
                    />
                  </Badge>
                ))}
                {selectedWarehouses.map(w => (
                  <Badge key={w} variant="secondary" className="text-xs gap-1">
                    <Warehouse className="h-3 w-3" />
                    {w}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => toggleWarehouse(w)}
                    />
                  </Badge>
                ))}
                {selectedLocations.map(l => (
                  <Badge key={l} variant="outline" className="text-xs gap-1">
                    <MapPin className="h-3 w-3" />
                    {l}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => toggleLocation(l)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid}>
            <Check className="h-4 w-4 mr-2" />
            Démarrer l'inventaire
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
