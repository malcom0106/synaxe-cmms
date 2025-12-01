import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, 
  Trash2, 
  Settings, 
  Wrench,
  Calendar,
  CheckCircle2,
  Package,
  Play,
  Users,
  BarChart3
} from 'lucide-react';

const MaintenanceRangeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-card">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="interventions">Interventions ({range.interventionsPlanned})</TabsTrigger>
          <TabsTrigger value="equipment">Équipements ({range.equipmentConcerned})</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
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

          {/* Actions rapides */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Actions rapides</h3>
            <div className="flex items-center gap-3">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Play className="h-4 w-4 mr-2" />
                Générer des interventions
              </Button>
              <Button variant="outline" className="bg-card">
                <Users className="h-4 w-4 mr-2" />
                Affecter des opérateurs
              </Button>
              <Button variant="outline" className="bg-card">
                <BarChart3 className="h-4 w-4 mr-2" />
                Voir les statistiques
              </Button>
            </div>
          </div>

          {/* Informations du programme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-4 w-4" />
                Informations du programme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Type d'opération</p>
                  <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-0">
                    {range.operationType}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Famille d'équipement</p>
                  <p className="text-sm font-medium text-foreground">{range.familyEquipment}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Périodicité</p>
                  <p className="text-sm font-medium text-foreground">{range.frequency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Sous-famille</p>
                  <p className="text-sm font-medium text-foreground">{range.subFamily}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Durée estimée</p>
                  <p className="text-sm font-medium text-foreground">{range.estimatedDuration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Créé le</p>
                  <p className="text-sm font-medium text-foreground">{range.createdDate}</p>
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

        <TabsContent value="interventions">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Liste des interventions à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Liste des équipements concernés...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Historique des modifications...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceRangeDetail;
