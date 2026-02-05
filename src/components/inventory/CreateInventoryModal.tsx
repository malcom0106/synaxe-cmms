import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layers, 
  Warehouse, 
  MapPin,
  Check,
  X
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
  type: 'families' | 'warehouses' | 'locations';
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
  const [activeTab, setActiveTab] = useState<'families' | 'warehouses' | 'locations'>('families');
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedSubFamilies, setSelectedSubFamilies] = useState<string[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const handleReset = () => {
    setSelectedFamilies([]);
    setSelectedSubFamilies([]);
    setSelectedWarehouses([]);
    setSelectedLocations([]);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm({
      type: activeTab,
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
      // Remove sub-families of this family
      const familySubFamilies = subFamilies[family] || [];
      setSelectedSubFamilies(selectedSubFamilies.filter(sf => !familySubFamilies.includes(sf)));
    } else {
      setSelectedFamilies([...selectedFamilies, family]);
    }
  };

  const toggleSubFamily = (subFamily: string, family: string) => {
    if (selectedSubFamilies.includes(subFamily)) {
      setSelectedSubFamilies(selectedSubFamilies.filter(sf => sf !== subFamily));
    } else {
      setSelectedSubFamilies([...selectedSubFamilies, subFamily]);
      // Auto-select parent family if not selected
      if (!selectedFamilies.includes(family)) {
        setSelectedFamilies([...selectedFamilies, family]);
      }
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
    switch (activeTab) {
      case 'families':
        return selectedFamilies.length + selectedSubFamilies.length;
      case 'warehouses':
        return selectedWarehouses.length;
      case 'locations':
        return selectedLocations.length;
      default:
        return 0;
    }
  };

  const isValid = getSelectionCount() > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvel inventaire</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Label className="text-sm text-muted-foreground mb-4 block">
            Sélectionnez le périmètre de l'inventaire. Vous pouvez choisir plusieurs éléments.
          </Label>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="families" className="gap-2">
                <Layers className="h-4 w-4" />
                Familles
              </TabsTrigger>
              <TabsTrigger value="warehouses" className="gap-2">
                <Warehouse className="h-4 w-4" />
                Magasins
              </TabsTrigger>
              <TabsTrigger value="locations" className="gap-2">
                <MapPin className="h-4 w-4" />
                Emplacements
              </TabsTrigger>
            </TabsList>

            {/* Families & Sub-families */}
            <TabsContent value="families" className="mt-4">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {families.map((family) => (
                    <div key={family} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`family-${family}`}
                          checked={selectedFamilies.includes(family)}
                          onCheckedChange={() => toggleFamily(family)}
                        />
                        <label
                          htmlFor={`family-${family}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {family}
                        </label>
                      </div>
                      {subFamilies[family] && subFamilies[family].length > 0 && (
                        <div className="ml-6 grid grid-cols-2 gap-2">
                          {subFamilies[family].map((sf) => (
                            <div key={sf} className="flex items-center space-x-2">
                              <Checkbox
                                id={`sf-${family}-${sf}`}
                                checked={selectedSubFamilies.includes(sf)}
                                onCheckedChange={() => toggleSubFamily(sf, family)}
                              />
                              <label
                                htmlFor={`sf-${family}-${sf}`}
                                className="text-xs text-muted-foreground cursor-pointer"
                              >
                                {sf}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Warehouses */}
            <TabsContent value="warehouses" className="mt-4">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {warehouses.map((warehouse) => (
                    <div key={warehouse} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
                      <Checkbox
                        id={`warehouse-${warehouse}`}
                        checked={selectedWarehouses.includes(warehouse)}
                        onCheckedChange={() => toggleWarehouse(warehouse)}
                      />
                      <label
                        htmlFor={`warehouse-${warehouse}`}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {warehouse}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Locations */}
            <TabsContent value="locations" className="mt-4">
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid grid-cols-2 gap-2">
                  {locations.map((location) => (
                    <div key={location} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
                      <Checkbox
                        id={`location-${location}`}
                        checked={selectedLocations.includes(location)}
                        onCheckedChange={() => toggleLocation(location)}
                      />
                      <label
                        htmlFor={`location-${location}`}
                        className="text-sm cursor-pointer"
                      >
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Selection summary */}
          {getSelectionCount() > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sélection</span>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-6 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Effacer
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedFamilies.map(f => (
                  <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                ))}
                {selectedSubFamilies.map(sf => (
                  <Badge key={sf} variant="outline" className="text-xs">{sf}</Badge>
                ))}
                {selectedWarehouses.map(w => (
                  <Badge key={w} variant="secondary" className="text-xs">{w}</Badge>
                ))}
                {selectedLocations.map(l => (
                  <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>
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
