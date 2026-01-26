import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar, 
  Clock, 
  Download, 
  Eye, 
  FileText, 
  ChevronRight 
} from 'lucide-react';

// Mock data
const equipmentData = {
  'EQ001': { 
    id: 'EQ001',
    reference: 'EQ001',
    name: 'Oléoserveur 201', 
    type: 'Oléoserveur',
    location: 'Zone A',
    parent: 'Système principal A',
    status: 'Actif',
    state: 'Opérationnel',
    lastMaintenance: '15/04/2023',
    nextMaintenance: '15/06/2023'
  },
  '202': { 
    id: '202',
    reference: 'EQ001',
    name: 'Oléoserveur 201', 
    type: 'Oléoserveur',
    location: 'Zone A',
    parent: 'Système principal A',
    status: 'Actif',
    state: 'Opérationnel',
    lastMaintenance: '15/04/2023',
    nextMaintenance: '15/06/2023'
  },
};

const mockChildren = [
  { name: 'Pompe principale', externalRef: 'VISPOMP448', status: 'Opérationnel' },
  { name: 'Filtre A', externalRef: 'VISFIL001', status: 'Opérationnel' },
  { name: 'Vanne de sécurité', externalRef: 'VISVAN123', status: 'Maintenance requise' },
  { name: 'Capteur de pression', externalRef: 'VISCAP789', status: 'Opérationnel' },
  { name: 'Pompe secondaire', externalRef: 'VISPOMP449', status: 'Opérationnel' },
  { name: 'Filtre B', externalRef: 'VISFIL002', status: 'Maintenance requise' },
];

const mockDocuments = [
  {
    name: 'Manuel_utilisation.pdf',
    uploadedBy: 'Jean Martin',
    uploadedAt: '2023-06-01'
  },
  {
    name: 'Certificat_conformité.pdf',
    uploadedBy: 'Jean Martin',
    uploadedAt: '2023-06-01'
  },
  {
    name: 'Rapport_inspection.pdf',
    uploadedBy: 'Sophie Bernard',
    uploadedAt: '2023-06-10'
  },
];

const mockInterventions = [
  {
    id: '#363',
    equipmentName: 'Oléoserveur',
    equipmentCode: '202',
    equipmentId: 'EQ001',
    gamme: 'Maintenance préventive',
    assignedTo: 'Jean Martin',
    assignedEmail: 'jmartin@example.com',
    plannedDate: '30/09/2025',
    plannedTime: '04:00',
    completedDate: '30/10/2025',
    completedTime: '15:54',
    status: 'Terminé'
  },
  {
    id: '#367',
    equipmentName: 'Oléoserveur',
    equipmentCode: '202',
    equipmentId: 'EQ002',
    gamme: 'Réparation',
    assignedTo: 'Non attribué',
    assignedEmail: null,
    plannedDate: '30/09/2025',
    plannedTime: '04:00',
    completedDate: '03/10/2025',
    completedTime: '16:03',
    status: 'Terminé'
  },
  {
    id: '#364',
    equipmentName: 'Oléoserveur',
    equipmentCode: '203',
    equipmentId: 'EQ003',
    gamme: 'Inspection',
    assignedTo: 'Sophie Bernard',
    assignedEmail: 'sbernard@example.com',
    plannedDate: '30/09/2025',
    plannedTime: '04:00',
    completedDate: '03/10/2025',
    completedTime: '17:43',
    status: 'Terminé'
  },
  {
    id: '#373',
    equipmentName: 'Compteur Zone',
    equipmentCode: '1',
    equipmentId: 'EQ004',
    gamme: 'Maintenance préventive',
    assignedTo: 'Non attribué',
    assignedEmail: null,
    plannedDate: '29/10/2025',
    plannedTime: '01:00',
    completedDate: null,
    completedTime: null,
    status: 'Planifié'
  },
];

const mockHistory = [
  {
    user: 'Marie Dubois',
    initials: 'MD',
    field: 'Statut',
    oldValue: 'Maintenance requise',
    newValue: 'Opérationnel',
    date: '2023-06-15 14:32'
  },
  {
    user: 'Jean Martin',
    initials: 'JM',
    field: 'Dernière maintenance',
    oldValue: '10/03/2023',
    newValue: '10/06/2023',
    date: '2023-06-10 09:15'
  },
  {
    user: 'Sophie Bernard',
    initials: 'SB',
    field: 'Localisation',
    oldValue: 'Zone B',
    newValue: 'Zone A',
    date: '2023-05-22 16:45'
  },
  {
    user: 'Pierre Lefebvre',
    initials: 'PL',
    field: 'Type',
    oldValue: 'Compteur',
    newValue: 'Oléoserveur',
    date: '2023-05-15 11:20'
  },
];

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const equipment = id ? equipmentData[id as keyof typeof equipmentData] : null;

  if (!equipment) {
    return (
      <div className="p-6 w-full bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Équipement introuvable</h2>
          <Button onClick={() => navigate('/equipment')}>Retour à la liste</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-background">
      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-3 bg-muted/30">
          <TabsTrigger value="equipment">Équipement</TabsTrigger>
          <TabsTrigger value="interventions">Liste des interventions</TabsTrigger>
          <TabsTrigger value="history">Historique des modifications</TabsTrigger>
        </TabsList>

        {/* Onglet Équipement */}
        <TabsContent value="equipment" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-6">
              {/* Informations */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Informations</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Référence</div>
                    <div className="text-sm font-medium text-foreground">{equipment.reference}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Nom</div>
                    <div className="text-sm font-medium text-foreground">{equipment.name}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Type</div>
                    <div className="text-sm text-foreground flex items-center gap-1">
                      <span className="text-muted-foreground">🔧</span>
                      {equipment.type}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Localisation</div>
                    <div className="text-sm text-foreground flex items-center gap-1">
                      <span className="text-muted-foreground">📍</span>
                      {equipment.location}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-sm text-muted-foreground mb-1">Équipement parent</div>
                    <div className="text-sm text-foreground flex items-center gap-1">
                      <span className="text-muted-foreground">👤</span>
                      {equipment.parent}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Statut */}
              <Card className="p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Statut</div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {equipment.status}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">État</div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {equipment.state}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Maintenance */}
              <Card className="p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Dernière maintenance</div>
                    <div className="text-sm text-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {equipment.lastMaintenance}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Prochaine maintenance</div>
                    <div className="text-sm text-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {equipment.nextMaintenance}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Colonne droite - Équipements enfants */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Équipements enfants</h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {/* Header */}
                <div className="grid grid-cols-3 gap-4 pb-2 border-b border-border text-xs font-medium text-muted-foreground">
                  <div>Nom</div>
                  <div>Référence externe</div>
                  <div>Statut</div>
                </div>
                {/* Rows */}
                {mockChildren.map((child, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 py-2 text-sm border-b border-border last:border-0">
                    <div className="font-medium text-foreground">{child.name}</div>
                    <div className="text-muted-foreground">{child.externalRef}</div>
                    <div>
                      <Badge 
                        className={
                          child.status === 'Opérationnel'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                        }
                      >
                        {child.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Valeurs référentielles - Pleine largeur */}
          <Card className="p-6 mt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Valeurs référentielles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kilométrage */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm">🚗</span>
                  </div>
                  <div className="text-sm font-medium text-foreground">Kilométrage</div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">245 890 km</div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    15/01/2024 à 14:32
                  </div>
                  <div>Par Jean Martin • Intervention #363</div>
                </div>
              </div>

              {/* Temps moteur */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm">⏱️</span>
                  </div>
                  <div className="text-sm font-medium text-foreground">Temps moteur</div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">12 458 h</div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    10/01/2024 à 09:15
                  </div>
                  <div>Par Sophie Bernard • Intervention #364</div>
                </div>
              </div>

              {/* Dernier index */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm">📊</span>
                  </div>
                  <div className="text-sm font-medium text-foreground">Dernier index</div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">1 547 203</div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    08/01/2024 à 16:45
                  </div>
                  <div>Par Pierre Lefebvre • Intervention #367</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Documents additionnels - Pleine largeur */}
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Documents additionnels</h2>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {mockDocuments.map((doc, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors border border-border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-5 w-5 text-foreground flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{doc.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {doc.uploadedBy} • {doc.uploadedAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Onglet Liste des interventions */}
        <TabsContent value="interventions" className="mt-0">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Liste des Interventions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left w-12">
                      <Checkbox />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Équipement
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Gamme
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Attribué à
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Date planifiée
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Date réalisée
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockInterventions.map((intervention) => (
                    <tr key={intervention.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <Checkbox />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {intervention.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-foreground">{intervention.equipmentName}</div>
                        <div className="text-sm font-medium text-foreground">{intervention.equipmentCode}</div>
                        <div className="text-xs text-muted-foreground">ID: {intervention.equipmentId}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-primary">
                        {intervention.gamme}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-foreground">{intervention.assignedTo}</div>
                        {intervention.assignedEmail && (
                          <div className="text-xs text-muted-foreground">{intervention.assignedEmail}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {intervention.plannedDate} {intervention.plannedTime}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {intervention.completedDate ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {intervention.completedDate} {intervention.completedTime}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Non définie</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          className={
                            intervention.status === 'Terminé'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                          }
                        >
                          {intervention.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" className="gap-1">
                          Détails
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
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

export default EquipmentDetail;