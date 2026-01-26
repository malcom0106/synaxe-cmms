import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Edit, FileText, ChevronUp, ChevronDown, Trash2, Lock, Gauge, Clock, Droplets, Info } from 'lucide-react';
import EditMaintenanceActionModal from '@/components/maintenance/EditMaintenanceActionModal';
import { isReferentialAction } from './MaintenanceActions';

// Mock data
interface ExpectedResult {
  variableName: string;
  label: string;
  type: 'Texte' | 'Nombre' | 'Oui/Non';
  required: boolean;
  minLength?: string;
  maxLength?: string;
  minValue?: string;
  maxValue?: string;
  defaultValue?: string;
}

// Actions référentielles avec leurs données
const referentialActionsData: Record<string, {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isReferential: boolean;
  linkedField: string;
  expectedResults: ExpectedResult[];
}> = {
  '-1': {
    id: '-1',
    name: 'Kilomètres',
    description: 'Action référentielle système liée au compteur kilométrique de l\'équipement. Cette action permet de déclencher des interventions de maintenance basées sur le kilométrage parcouru.',
    isActive: true,
    isReferential: true,
    linkedField: 'Compteur kilométrique',
    expectedResults: [
      {
        variableName: 'kilometres_value',
        label: 'Valeur du compteur',
        type: 'Nombre',
        required: true,
        minValue: '0',
        defaultValue: '0'
      }
    ]
  },
  '-2': {
    id: '-2',
    name: 'Temps',
    description: 'Action référentielle système liée au temps de fonctionnement moteur. Cette action permet de déclencher des interventions de maintenance basées sur les heures de fonctionnement.',
    isActive: true,
    isReferential: true,
    linkedField: 'Compteur horaire moteur',
    expectedResults: [
      {
        variableName: 'temps_value',
        label: 'Heures de fonctionnement',
        type: 'Nombre',
        required: true,
        minValue: '0',
        defaultValue: '0'
      }
    ]
  },
  '-3': {
    id: '-3',
    name: 'Litrage',
    description: 'Action référentielle système liée au volume de fluide consommé ou distribué. Cette action permet de déclencher des interventions de maintenance basées sur le litrage.',
    isActive: true,
    isReferential: true,
    linkedField: 'Compteur de litrage',
    expectedResults: [
      {
        variableName: 'litrage_value',
        label: 'Volume (litres)',
        type: 'Nombre',
        required: true,
        minValue: '0',
        defaultValue: '0'
      }
    ]
  },
};

const maintenanceActionsData: Record<string, {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  expectedResults: ExpectedResult[];
}> = {
  '1': {
    id: '1',
    name: 'Contrôle visuel',
    description: 'Vérification visuelle de l\'équipement pour détecter tout signe d\'usure, de dommage ou d\'anomalie.',
    isActive: true,
    expectedResults: [
      {
        variableName: 'variable_1765276301014',
        label: 'Observation générale',
        type: 'Texte',
        required: false,
        minLength: '10',
        maxLength: '500',
        defaultValue: 'Aucune anomalie détectée'
      },
      {
        variableName: 'variable_1765276317556',
        label: 'Niveau d\'usure (%)',
        type: 'Nombre',
        required: true,
        minValue: '0',
        maxValue: '100',
        defaultValue: '0'
      },
      {
        variableName: 'variable_1765276327870',
        label: 'Conformité validée',
        type: 'Oui/Non',
        required: false,
        defaultValue: 'Oui'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Graissage',
    description: 'Application de graisse sur les points de lubrification définis pour assurer le bon fonctionnement des pièces mobiles.',
    isActive: true,
    expectedResults: []
  },
  '3': {
    id: '3',
    name: 'Remplacement filtres',
    description: 'Changement des filtres à air et à huile selon les préconisations du constructeur.',
    isActive: false,
    expectedResults: []
  },
  '4': {
    id: '4',
    name: 'Nettoyage complet',
    description: 'Nettoyage approfondi de l\'équipement incluant toutes les surfaces accessibles et les composants externes.',
    isActive: true,
    expectedResults: []
  },
  '5': {
    id: '5',
    name: 'Calibration',
    description: 'Calibration des capteurs et instruments de mesure pour garantir la précision des données.',
    isActive: false,
    expectedResults: []
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

interface Document {
  id: string;
  name: string;
  type: string;
}

// Fonction pour obtenir l'icône d'une action référentielle
const getReferentialIcon = (id: string) => {
  switch (id) {
    case '-1':
      return <Gauge className="h-5 w-5" />;
    case '-2':
      return <Clock className="h-5 w-5" />;
    case '-3':
      return <Droplets className="h-5 w-5" />;
    default:
      return null;
  }
};

const MaintenanceActionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Déterminer si c'est une action référentielle
  const isReferential = id ? isReferentialAction(id) : false;
  
  // Charger les données appropriées
  const [actionData, setActionData] = useState(() => {
    if (!id) return null;
    if (isReferential) {
      return referentialActionsData[id] || null;
    }
    return maintenanceActionsData[id] || null;
  });
  
  const action = actionData;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleAddDocument = () => {
    if (isReferential) return; // Pas de modification pour les actions référentielles
    const newDoc: Document = {
      id: Date.now().toString(),
      name: `Document_${documents.length + 1}.pdf`,
      type: 'PDF'
    };
    setDocuments([...documents, newDoc]);
  };

  const handleDeleteDocument = (docId: string) => {
    if (isReferential) return;
    setDocuments(documents.filter(d => d.id !== docId));
  };

  const handleSave = (updatedAction: { id: string; name: string; description: string; isActive: boolean }) => {
    if (action && !isReferential) {
      setActionData({
        ...action,
        ...updatedAction,
      });
    }
  };

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isReferential && (
            <div className="text-orange-600">
              {getReferentialIcon(action.id)}
            </div>
          )}
          <h1 className={`text-2xl font-bold ${isReferential ? 'text-orange-600' : 'text-foreground'}`}>
            {action.name}
          </h1>
          {isReferential && (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">
              Référentiel
            </Badge>
          )}
          <Badge className={action.isActive 
            ? "bg-green-500/10 text-green-600 hover:bg-green-500/10 border-0" 
            : "bg-muted text-muted-foreground hover:bg-muted border-0"
          }>
            {action.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
        {isReferential ? (
          <Button className="bg-muted hover:bg-muted text-muted-foreground cursor-not-allowed" disabled>
            <Lock className="h-4 w-4 mr-2" />
            Non modifiable
          </Button>
        ) : (
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        )}
      </div>

      {/* Bannière d'information pour les actions référentielles */}
      {isReferential && (
        <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3">
          <Info className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800">Action référentielle système</p>
            <p className="text-sm text-orange-700 mt-1">
              Cette action est gérée par le système et ne peut pas être modifiée ou supprimée. 
              Elle est utilisée pour définir des périodicités de maintenance basées sur des valeurs équipement 
              (kilométrage, temps de fonctionnement, litrage).
            </p>
          </div>
        </div>
      )}

      {!isReferential && (
        <EditMaintenanceActionModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          action={action}
          onSave={handleSave}
        />
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-2 bg-muted/30">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="history" disabled={isReferential}>
            Historique des modifications
          </TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-6">
              {/* Général */}
              <Card className={`p-6 ${isReferential ? 'border-orange-200 bg-orange-50/30' : ''}`}>
                <h2 className="text-lg font-semibold text-foreground mb-4">Général</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Nom</div>
                    <div className={`text-sm font-medium ${isReferential ? 'text-orange-600' : 'text-foreground'}`}>
                      {action.name}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Description</div>
                    <div className="text-sm text-foreground">{action.description}</div>
                  </div>

                  {/* Champ lié pour les actions référentielles */}
                  {isReferential && 'linkedField' in action && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Champ équipement lié</div>
                      <div className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          {(action as { linkedField: string }).linkedField}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Documents additionnels - Masqué pour les actions référentielles */}
              {!isReferential && (
                <Card className="p-0 overflow-hidden">
                  <Collapsible open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold text-foreground">Documents additionnels</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90"
                          onClick={handleAddDocument}
                        >
                          Ajouter
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            {isDocumentsOpen ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="p-4">
                        {documents.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            Aucun document trouvé
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {documents.map((doc) => (
                              <div 
                                key={doc.id} 
                                className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-foreground">{doc.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              )}
            </div>

            {/* Colonne droite - Résultat(s) attendu(s) */}
            <div>
              <Card className={`p-6 ${isReferential ? 'border-orange-200 bg-orange-50/30' : ''}`}>
                <h2 className="text-lg font-semibold text-foreground mb-4">Résultat(s) attendu(s)</h2>
                {action.expectedResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Aucun résultat attendu défini</p>
                ) : (
                  <div className="space-y-4">
                    {action.expectedResults.map((result, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${isReferential ? 'border-orange-200 bg-orange-50/50' : 'border-border bg-muted/20'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-medium ${isReferential ? 'text-orange-700' : 'text-foreground'}`}>
                            {result.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${isReferential ? 'border-orange-300' : ''}`}>
                              {result.type}
                            </Badge>
                            {result.required && (
                              <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/10 border-0 text-xs">
                                Obligatoire
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Nom de la variable:</span>
                            <span className="ml-2 text-foreground font-mono text-xs">{result.variableName}</span>
                          </div>
                          {result.type === 'Texte' && (
                            <>
                              {result.minLength && (
                                <div>
                                  <span className="text-muted-foreground">Longueur min:</span>
                                  <span className="ml-2 text-foreground">{result.minLength}</span>
                                </div>
                              )}
                              {result.maxLength && (
                                <div>
                                  <span className="text-muted-foreground">Longueur max:</span>
                                  <span className="ml-2 text-foreground">{result.maxLength}</span>
                                </div>
                              )}
                            </>
                          )}
                          {result.type === 'Nombre' && (
                            <>
                              {result.minValue && (
                                <div>
                                  <span className="text-muted-foreground">Valeur min:</span>
                                  <span className="ml-2 text-foreground">{result.minValue}</span>
                                </div>
                              )}
                              {result.maxValue && (
                                <div>
                                  <span className="text-muted-foreground">Valeur max:</span>
                                  <span className="ml-2 text-foreground">{result.maxValue}</span>
                                </div>
                              )}
                            </>
                          )}
                          {result.defaultValue && (
                            <div>
                              <span className="text-muted-foreground">Valeur par défaut:</span>
                              <span className="ml-2 text-foreground">{result.defaultValue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  className="flex items-start gap-3 pb-4 border-b border-border last:border-0"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {entry.initials}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">{entry.user}</span>
                          {' '}a mis à jour{' '}
                          <span className="font-semibold text-foreground">{entry.field}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-muted-foreground line-through">{entry.oldValue}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground">{entry.newValue}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {entry.date}
                      </span>
                    </div>
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