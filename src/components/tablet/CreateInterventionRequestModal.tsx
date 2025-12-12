import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Camera, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Equipment {
  id: string;
  name: string;
  referenceExterne: string;
  type: string;
  family: string;
  subFamily: string;
}

interface CreateInterventionRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    equipmentId: string;
    equipmentName: string;
    photo?: string;
  }) => void;
}

const equipmentList: Equipment[] = [
  { 
    id: 'EQ001', 
    name: '202', 
    referenceExterne: 'camion 202 oléo',
    type: 'Oléoserveur',
    family: 'Camion',
    subFamily: 'Oléoserveur'
  },
  { 
    id: 'EQ002', 
    name: '215', 
    referenceExterne: 'camion 215 Citerne',
    type: 'Citerne',
    family: 'Camion',
    subFamily: 'Citerne'
  },
  { 
    id: 'EQ003', 
    name: 'Cuve 108', 
    referenceExterne: 'cuve banc de test',
    type: 'Cuve',
    family: 'Cuve',
    subFamily: 'Cuve stockage'
  },
  { 
    id: 'EQ004', 
    name: 'Escabeau E01', 
    referenceExterne: 'escabeau camion zone A',
    type: 'Escabeau',
    family: 'Escabeau',
    subFamily: 'Escabeau camion'
  },
];

const families = ['Camion', 'Cuve', 'Escabeau'];
const subFamilies: Record<string, string[]> = {
  'Camion': ['Oléoserveur', 'Citerne'],
  'Cuve': ['Cuve stockage'],
  'Escabeau': ['Escabeau camion'],
};

export const CreateInterventionRequestModal: React.FC<CreateInterventionRequestModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [familyFilter, setFamilyFilter] = useState<string>('');
  const [subFamilyFilter, setSubFamilyFilter] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableSubFamilies = familyFilter ? subFamilies[familyFilter] || [] : [];

  const filteredEquipment = equipmentList.filter((eq) => {
    const matchesSearch = 
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.referenceExterne.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFamily = !familyFilter || eq.family === familyFilter;
    const matchesSubFamily = !subFamilyFilter || eq.subFamily === subFamilyFilter;
    
    return matchesSearch && matchesFamily && matchesSubFamily;
  });

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title || !selectedEquipment) return;
    
    onSubmit({
      title,
      description,
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      photo: photo || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedEquipment(null);
    setSearchQuery('');
    setFamilyFilter('');
    setSubFamilyFilter('');
    setPhoto(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedEquipment(null);
    setSearchQuery('');
    setFamilyFilter('');
    setSubFamilyFilter('');
    setPhoto(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Nouvelle demande d'intervention</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Équipement concerné */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Équipement concerné *</Label>
            
            {selectedEquipment ? (
              <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{selectedEquipment.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedEquipment.referenceExterne}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEquipment(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                {/* Filtres */}
                <div className="grid grid-cols-2 gap-3">
                  <Select value={familyFilter} onValueChange={(value) => {
                    setFamilyFilter(value === 'all' ? '' : value);
                    setSubFamilyFilter('');
                  }}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Filtrer par famille" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les familles</SelectItem>
                      {families.map((family) => (
                        <SelectItem key={family} value={family}>{family}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={subFamilyFilter} 
                    onValueChange={(value) => setSubFamilyFilter(value === 'all' ? '' : value)}
                    disabled={!familyFilter}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Filtrer par sous-famille" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les sous-familles</SelectItem>
                      {availableSubFamilies.map((subFamily) => (
                        <SelectItem key={subFamily} value={subFamily}>{subFamily}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un équipement..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Liste des équipements */}
                <div className="max-h-48 overflow-y-auto border border-border rounded-lg divide-y divide-border">
                  {filteredEquipment.length > 0 ? (
                    filteredEquipment.map((eq) => (
                      <button
                        key={eq.id}
                        className={cn(
                          "w-full p-3 text-left hover:bg-muted/50 transition-colors",
                          selectedEquipment?.id === eq.id && "bg-primary/10"
                        )}
                        onClick={() => setSelectedEquipment(eq)}
                      >
                        <p className="font-medium text-foreground">{eq.name}</p>
                        <p className="text-sm text-muted-foreground">{eq.referenceExterne}</p>
                        <p className="text-xs text-primary mt-1">{eq.family} - {eq.subFamily}</p>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      Aucun équipement trouvé
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">Titre *</Label>
            <Input
              id="title"
              placeholder="Titre de la demande..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème rencontré..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Photo</Label>
            
            {photo ? (
              <div className="relative">
                <img 
                  src={photo} 
                  alt="Photo jointe" 
                  className="w-full max-h-48 object-cover rounded-lg border border-border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setPhoto(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-24 flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-sm">Prendre une photo</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-24 flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-6 w-6" />
                  <span className="text-sm">Choisir une image</span>
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Annuler
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSubmit}
            disabled={!title || !selectedEquipment}
          >
            Créer la demande
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
