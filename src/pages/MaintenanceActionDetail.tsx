import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Clock,
  Tag,
  FileText,
  Edit
} from 'lucide-react';

// Mock data
const maintenanceActionsData: Record<string, {
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedTime: string;
  instructions: string;
  requiredTools: string[];
  safetyNotes: string;
  createdAt: string;
  createdBy: string;
}> = {
  '1': {
    id: '1',
    name: 'Contrôle visuel',
    category: 'Inspection',
    description: 'Vérification visuelle de l\'équipement pour détecter tout signe d\'usure, de dommage ou d\'anomalie.',
    estimatedTime: '15 min',
    instructions: 'Inspecter visuellement toutes les parties accessibles de l\'équipement. Vérifier l\'absence de fuites, fissures, corrosion ou déformations.',
    requiredTools: ['Lampe torche', 'Miroir d\'inspection', 'Caméra'],
    safetyNotes: 'S\'assurer que l\'équipement est à l\'arrêt avant l\'inspection.',
    createdAt: '2023-01-15',
    createdBy: 'Jean Martin'
  },
  '2': {
    id: '2',
    name: 'Graissage',
    category: 'Lubrification',
    description: 'Application de graisse sur les points de lubrification définis pour assurer le bon fonctionnement des pièces mobiles.',
    estimatedTime: '30 min',
    instructions: 'Identifier tous les points de graissage. Nettoyer les graisseurs avant application. Appliquer la quantité recommandée de graisse.',
    requiredTools: ['Pistolet à graisse', 'Chiffons', 'Graisse compatible'],
    safetyNotes: 'Porter des gants de protection. Utiliser uniquement la graisse spécifiée.',
    createdAt: '2023-02-20',
    createdBy: 'Sophie Bernard'
  },
  '3': {
    id: '3',
    name: 'Remplacement filtres',
    category: 'Remplacement',
    description: 'Changement des filtres à air et à huile selon les préconisations du constructeur.',
    estimatedTime: '45 min',
    instructions: 'Arrêter l\'équipement. Retirer les anciens filtres. Vérifier l\'état des joints. Installer les nouveaux filtres. Contrôler l\'étanchéité.',
    requiredTools: ['Clé à filtre', 'Bac de récupération', 'Filtres neufs', 'Joints'],
    safetyNotes: 'Attendre le refroidissement de l\'équipement. Disposer correctement des filtres usagés.',
    createdAt: '2023-03-10',
    createdBy: 'Pierre Lefebvre'
  },
  '4': {
    id: '4',
    name: 'Nettoyage complet',
    category: 'Nettoyage',
    description: 'Nettoyage approfondi de l\'équipement incluant toutes les surfaces accessibles et les composants externes.',
    estimatedTime: '1h',
    instructions: 'Déconnecter l\'alimentation. Utiliser les produits de nettoyage appropriés. Nettoyer méthodiquement toutes les surfaces. Sécher complètement avant remise en service.',
    requiredTools: ['Produits de nettoyage', 'Chiffons microfibres', 'Air comprimé', 'Aspirateur'],
    safetyNotes: 'Ne pas utiliser d\'eau sur les composants électriques. Porter des équipements de protection.',
    createdAt: '2023-04-05',
    createdBy: 'Marie Dubois'
  },
  '5': {
    id: '5',
    name: 'Calibration',
    category: 'Réglage',
    description: 'Calibration des capteurs et instruments de mesure pour garantir la précision des données.',
    estimatedTime: '1h 30min',
    instructions: 'Utiliser les étalons de référence. Suivre la procédure de calibration spécifique. Documenter les valeurs avant et après calibration.',
    requiredTools: ['Étalons de référence', 'Multimètre', 'Logiciel de calibration', 'Tournevis de précision'],
    safetyNotes: 'Travailler dans un environnement stable. Manipuler les instruments avec précaution.',
    createdAt: '2023-05-12',
    createdBy: 'Jean Martin'
  },
};

const mockHistory = [
  {
    user: 'Marie Dubois',
    initials: 'MD',
    field: 'Description',
    oldValue: 'Vérification visuelle simple',
    newValue: 'Vérification visuelle de l\'équipement pour détecter tout signe d\'usure, de dommage ou d\'anomalie.',
    date: '2023-06-15 14:32'
  },
  {
    user: 'Jean Martin',
    initials: 'JM',
    field: 'Temps estimé',
    oldValue: '10 min',
    newValue: '15 min',
    date: '2023-06-10 09:15'
  },
  {
    user: 'Sophie Bernard',
    initials: 'SB',
    field: 'Catégorie',
    oldValue: 'Contrôle',
    newValue: 'Inspection',
    date: '2023-05-22 16:45'
  },
  {
    user: 'Pierre Lefebvre',
    initials: 'PL',
    field: 'Instructions',
    oldValue: 'Inspecter l\'équipement',
    newValue: 'Inspecter visuellement toutes les parties accessibles...',
    date: '2023-05-15 11:20'
  },
];

const MaintenanceActionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const action = id ? maintenanceActionsData[id] : null;

  if (!action) {
    return (
      <div className="p-6 w-full bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Action introuvable</h2>
          <Button onClick={() => navigate('/maintenance/actions')}>Retour à la liste</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-background">
      {/* Header avec bouton retour */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/maintenance/actions')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{action.name}</h1>
          <p className="text-muted-foreground">{action.category}</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-2 bg-muted/30">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="history">Historique des modifications</TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-6">
              {/* Informations générales */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Informations générales</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Nom</div>
                    <div className="text-sm font-medium text-foreground">{action.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Catégorie</div>
                    <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-0">
                      <Tag className="h-3 w-3 mr-1" />
                      {action.category}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Temps estimé</div>
                    <div className="text-sm text-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {action.estimatedTime}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Description</div>
                    <div className="text-sm text-foreground">{action.description}</div>
                  </div>
                </div>
              </Card>

              {/* Métadonnées */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Métadonnées</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Date de création</div>
                    <div className="text-sm font-medium text-foreground">{action.createdAt}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Créé par</div>
                    <div className="text-sm font-medium text-foreground">{action.createdBy}</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Colonne droite */}
            <div className="space-y-6">
              {/* Instructions */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  <FileText className="h-5 w-5 inline mr-2" />
                  Instructions
                </h2>
                <p className="text-sm text-foreground">{action.instructions}</p>
              </Card>

              {/* Outils requis */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Outils requis</h2>
                <div className="flex flex-wrap gap-2">
                  {action.requiredTools.map((tool, index) => (
                    <Badge key={index} variant="outline" className="text-foreground">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Notes de sécurité */}
              <Card className="p-6 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
                <h2 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-4">
                  ⚠️ Notes de sécurité
                </h2>
                <p className="text-sm text-orange-700 dark:text-orange-300">{action.safetyNotes}</p>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Historique des modifications */}
        <TabsContent value="history" className="mt-0">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Historique des modifications</h2>
            <div className="space-y-4">
              {mockHistory.map((entry, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary flex-shrink-0">
                    {entry.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{entry.user}</span>
                      <span className="text-muted-foreground">a modifié</span>
                      <Badge variant="outline" className="text-xs">{entry.field}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="line-through text-red-500/70">{entry.oldValue}</span>
                      <span className="mx-2">→</span>
                      <span className="text-green-600">{entry.newValue}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{entry.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceActionDetail;
