import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Edit, FileText, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

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

const MaintenanceActionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const action = id ? maintenanceActionsData[id] : null;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(true);

  const handleAddDocument = () => {
    // Mock add document
    const newDoc: Document = {
      id: Date.now().toString(),
      name: `Document_${documents.length + 1}.pdf`,
      type: 'PDF'
    };
    setDocuments([...documents, newDoc]);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(d => d.id !== docId));
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
          <h1 className="text-2xl font-bold text-foreground">{action.name}</h1>
          <Badge className={action.isActive 
            ? "bg-green-500/10 text-green-600 hover:bg-green-500/10 border-0" 
            : "bg-muted text-muted-foreground hover:bg-muted border-0"
          }>
            {action.isActive ? 'Actif' : 'Inactif'}
          </Badge>
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
              {/* Général */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Général</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Nom</div>
                    <div className="text-sm font-medium text-foreground">{action.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Description</div>
                    <div className="text-sm text-foreground">{action.description}</div>
                  </div>
                </div>
              </Card>

              {/* Documents additionnels */}
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
            </div>

            {/* Colonne droite - Résultat(s) attendu(s) */}
            <div>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Résultat(s) attendu(s)</h2>
                {action.expectedResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Aucun résultat attendu défini</p>
                ) : (
                  <div className="space-y-4">
                    {action.expectedResults.map((result, index) => (
                      <div key={index} className="p-4 rounded-lg border border-border bg-muted/20">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-foreground">{result.label}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{result.type}</Badge>
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
