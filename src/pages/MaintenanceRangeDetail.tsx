import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Edit, 
  Settings, 
  Wrench,
  Calendar,
  CheckCircle2,
  Package,
  Play,
  Search,
  User,
  Truck,
  Clock
} from 'lucide-react';
import { EditMaintenanceRangeModal } from '@/components/maintenance/EditMaintenanceRangeModal';

const MaintenanceRangeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data - remplacer par de vraies données plus tard
  const range = {
    id: 1,
    name: 'Check Quotidienne Oléoserveur',
    type: 'Programme de maintenance préventive',
    operationType: 'Préventive',
    frequency: 'Quotidien',
    estimatedDuration: '0h 6min',
    familyEquipment: 'Camion',
    subFamily: 'Oléoserveur',
    createdDate: 'Date inconnue',
    interventionsPlanned: 94,
    interventionsCompleted: 2,
    equipmentConcerned: 2,
    actions: [
      {
        id: 1,
        title: 'Étape 1 check',
        description: 'Contrôle visuel 360 ° autour de l\'oléoserveur Détection d\'anomalie (Tuyaux, câbles électriques, ...)'
      },
      {
        id: 2,
        title: 'Étape 2 check',
        description: 'Contrôler les niveaux et vérifier l\'absence de fuites : huile moteur, liquide hydrauliques, liquide de refroidissement, niveau de gasoil, fuite d\'air ...'
      },
      {
        id: 3,
        title: 'Étape 3 check',
        description: 'Vérifier la présence du scellé intact sur la commande de neutralisation des interlocks'
      }
    ]
  };

  return (
    <div className="p-6 w-full bg-background">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              {range.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {range.type}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="active-status" className="text-sm font-medium">
                Actif
              </Label>
              <Switch id="active-status" defaultChecked />
            </div>
            <Button variant="outline" className="bg-card" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Play className="h-4 w-4 mr-2" />
              Générer un plan
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="py-3">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="interventions" className="py-3">Interventions</TabsTrigger>
          <TabsTrigger value="equipment" className="py-3">Équipements</TabsTrigger>
          <TabsTrigger value="history" className="py-3">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Interventions planifiées</p>
                    <p className="text-3xl font-bold text-blue-600">{range.interventionsPlanned}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-100">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Interventions complétées</p>
                    <p className="text-3xl font-bold text-green-600">{range.interventionsCompleted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Équipements concernés</p>
                    <p className="text-3xl font-bold text-purple-600">{range.equipmentConcerned}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Général */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-4 w-4" />
                Général
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Type d'intervention</p>
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-0">
                      {range.operationType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Périodicité</p>
                    <p className="text-sm font-medium text-foreground">{range.frequency}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Famille d'équipement</p>
                    <p className="text-sm font-medium text-foreground">{range.familyEquipment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Sous-famille</p>
                    <p className="text-sm font-medium text-foreground">{range.subFamily}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Durée estimée</p>
                    <p className="text-sm font-medium text-foreground">{range.estimatedDuration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Créé le</p>
                    <p className="text-sm font-medium text-foreground">{range.createdDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions de maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="h-4 w-4" />
                Actions de maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {range.actions.map((action) => (
                  <div 
                    key={action.id}
                    className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg mt-1">
                      <Wrench className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {action.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          {/* Barre de recherche */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une intervention..."
                className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="mb-6 flex flex-wrap gap-3">
            <Select>
              <SelectTrigger className="w-[200px] bg-card">
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sélectionner un opérateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operateur1">Opérateur 1</SelectItem>
                <SelectItem value="operateur2">Opérateur 2</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="bg-card">
              <Calendar className="h-4 w-4 mr-2" />
              27 Nov 2025 - 28 Nov 2025
            </Button>

            <Select>
              <SelectTrigger className="w-[200px] bg-card">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="planifie">Planifié</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left w-12">
                        <Checkbox />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Équipement
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Opérateur
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Date planifiée
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Date réalisée
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card">
                    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Checkbox />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        #1
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        Oléoserveur 202
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        Non attribué
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-red-600">
                          <Calendar className="h-3.5 w-3.5" />
                          26/11/2025 01:00
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        26/11/2025 11:29
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-0">
                          Terminé
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Checkbox />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        #2
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        Oléoserveur 202
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        Non attribué
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-red-600">
                          <Calendar className="h-3.5 w-3.5" />
                          28/11/2025 01:00
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        -
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-0">
                          Planifié
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          {/* Barre de recherche */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un équipement..."
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
          <Card>
            <CardContent className="p-0">
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
                    <tr className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        202
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        camion 202 oléo
                      </td>
                      <td className="px-4 py-3 text-sm text-primary">
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2" />
                          Oléoserveur
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          26/11/2025
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Opérationnel
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Actif
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        215
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        camion 215 Citerne
                      </td>
                      <td className="px-4 py-3 text-sm text-primary">
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2" />
                          Citerne
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          26/11/2025
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Opérationnel
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Actif
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historique des modifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">MD</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">Marie Dubois</span>
                          {' '}a mis à jour{' '}
                          <span className="font-semibold text-foreground">Statut</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-muted-foreground line-through">Inactif</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground">Actif</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        2023-06-15 14:32
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">JM</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">Jean Martin</span>
                          {' '}a mis à jour{' '}
                          <span className="font-semibold text-foreground">Périodicité</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-muted-foreground line-through">Hebdomadaire</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground">Quotidien</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        2023-06-10 09:15
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">SB</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">Sophie Bernard</span>
                          {' '}a mis à jour{' '}
                          <span className="font-semibold text-foreground">Famille d'équipement</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-muted-foreground line-through">Véhicule</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground">Camion</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        2023-05-22 16:45
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <EditMaintenanceRangeModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        rangeData={range}
      />
    </div>
  );
};

export default MaintenanceRangeDetail;
