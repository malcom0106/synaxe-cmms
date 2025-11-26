import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Truck, MapPin, Calendar, Clock, User, Upload, FileText, Download, Eye, ChevronRight } from 'lucide-react';

// Mock data - same structure as Equipment page
const equipmentData = {
  'EQ001': { 
    id: 'EQ001', 
    name: 'Oléoserveur 201', 
    type: 'Oléoserveur', 
    status: 'operational',
    active: true,
    lastMaintenance: '15/04/2023',
    nextMaintenance: '15/06/2023',
    location: 'Zone A',
    parent: 'Système principal A'
  },
  'EQ002': { 
    id: 'EQ002', 
    name: 'Oléoserveur 202', 
    type: 'Oléoserveur', 
    status: 'maintenance_required',
    active: false,
    lastMaintenance: '10/03/2023',
    nextMaintenance: '10/05/2023',
    location: 'Zone A',
    parent: 'Système principal A'
  },
  'EQ003': { 
    id: 'EQ003', 
    name: 'Oléoserveur 203', 
    type: 'Oléoserveur', 
    status: 'operational',
    active: true,
    lastMaintenance: '20/04/2023',
    nextMaintenance: '20/06/2023',
    location: 'Zone B',
    parent: 'Système principal B'
  },
  'EQ004': { 
    id: 'EQ004', 
    name: 'Compteur Zone 1', 
    type: 'Compteur', 
    status: 'operational',
    active: true,
    lastMaintenance: '05/05/2023',
    nextMaintenance: '05/11/2023',
    location: 'Zone 1',
    parent: null
  },
  'EQ005': { 
    id: 'EQ005', 
    name: 'Citerne principale', 
    type: 'Citerne', 
    status: 'operational',
    active: true,
    lastMaintenance: '01/02/2023',
    nextMaintenance: '01/08/2023',
    location: 'Dépôt',
    parent: null
  },
};

// Mock modification history
const mockHistory = [
  {
    id: 1,
    date: '2023-06-15 14:32',
    user: 'Marie Dubois',
    field: 'Statut',
    oldValue: 'Maintenance requise',
    newValue: 'Opérationnel',
  },
  {
    id: 2,
    date: '2023-06-10 09:15',
    user: 'Jean Martin',
    field: 'Dernière maintenance',
    oldValue: '10/03/2023',
    newValue: '10/06/2023',
  },
  {
    id: 3,
    date: '2023-05-22 16:45',
    user: 'Sophie Bernard',
    field: 'Localisation',
    oldValue: 'Zone B',
    newValue: 'Zone A',
  },
  {
    id: 4,
    date: '2023-05-15 11:20',
    user: 'Pierre Lefebvre',
    field: 'Type',
    oldValue: 'Compteur',
    newValue: 'Oléoserveur',
  },
];

// Mock children equipment
const mockChildren = [
  { id: 'EQ-CH-001', name: 'Pompe principale', externalRef: 'VISPOMP448', status: 'operational' },
  { id: 'EQ-CH-002', name: 'Filtre A', externalRef: 'VISFIL001', status: 'operational' },
  { id: 'EQ-CH-003', name: 'Vanne de sécurité', externalRef: 'VISVAN123', status: 'maintenance_required' },
  { id: 'EQ-CH-004', name: 'Capteur de pression', externalRef: 'VISCAP789', status: 'operational' },
  { id: 'EQ-CH-005', name: 'Pompe secondaire', externalRef: 'VISPOMP449', status: 'operational' },
  { id: 'EQ-CH-006', name: 'Filtre B', externalRef: 'VISFIL002', status: 'maintenance_required' },
  { id: 'EQ-CH-007', name: 'Vanne principale', externalRef: 'VISVAN124', status: 'operational' },
  { id: 'EQ-CH-008', name: 'Capteur de température', externalRef: 'VISCAP790', status: 'operational' },
  { id: 'EQ-CH-009', name: 'Régulateur de débit', externalRef: 'VISREG001', status: 'operational' },
  { id: 'EQ-CH-010', name: 'Manomètre', externalRef: 'VISMAN001', status: 'maintenance_required' },
];

// Mock documents
const mockDocuments = [
  {
    id: 'DOC-001',
    name: 'Manuel_utilisation.pdf',
    uploadedBy: 'Marie Dubois',
    uploadedAt: '2023-05-15',
    size: '2.4 MB'
  },
  {
    id: 'DOC-002',
    name: 'Certificat_conformité.pdf',
    uploadedBy: 'Jean Martin',
    uploadedAt: '2023-06-01',
    size: '1.1 MB'
  },
  {
    id: 'DOC-003',
    name: 'Rapport_inspection.pdf',
    uploadedBy: 'Sophie Bernard',
    uploadedAt: '2023-06-10',
    size: '3.8 MB'
  },
];

// Mock interventions
const mockInterventions = [
  {
    id: 'INT-001',
    number: '#363',
    equipmentName: 'Oléoserveur 201',
    equipmentId: 'EQ001',
    gamme: 'Maintenance préventive',
    assignedTo: 'Jean Martin',
    assignedEmail: 'jmartin@example.com',
    plannedDate: '30/09/2025 04:00',
    completedDate: '30/10/2025 15:54',
    status: 'completed'
  },
  {
    id: 'INT-002',
    number: '#367',
    equipmentName: 'Oléoserveur 202',
    equipmentId: 'EQ002',
    gamme: 'Réparation',
    assignedTo: 'Non attribué',
    assignedEmail: null,
    plannedDate: '30/09/2025 04:00',
    completedDate: '03/10/2025 16:03',
    status: 'completed'
  },
  {
    id: 'INT-003',
    number: '#364',
    equipmentName: 'Oléoserveur 203',
    equipmentId: 'EQ003',
    gamme: 'Inspection',
    assignedTo: 'Sophie Bernard',
    assignedEmail: 'sbernard@example.com',
    plannedDate: '30/09/2025 04:00',
    completedDate: '03/10/2025 17:43',
    status: 'completed'
  },
  {
    id: 'INT-004',
    number: '#373',
    equipmentName: 'Compteur Zone 1',
    equipmentId: 'EQ004',
    gamme: 'Maintenance préventive',
    assignedTo: 'Non attribué',
    assignedEmail: null,
    plannedDate: '29/10/2025 01:00',
    completedDate: 'Non définie',
    status: 'planned'
  },
];

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const equipment = id ? equipmentData[id as keyof typeof equipmentData] : null;

  if (!equipment) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Équipement introuvable</h2>
          <Button onClick={() => navigate('/equipment')}>Retour à la liste</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/equipment')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la liste
      </Button>

      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-3">
          <TabsTrigger value="equipment">Équipement</TabsTrigger>
          <TabsTrigger value="interventions">Liste des interventions</TabsTrigger>
          <TabsTrigger value="history">Historique des modifications</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Informations</h2>
          
          {/* Premier groupe d'informations */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Référence</div>
              <div className="font-medium text-foreground">{equipment.id}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-1">Nom</div>
              <div className="font-medium text-foreground">{equipment.name}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Type</div>
              <div className="flex items-center text-foreground">
                <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                {equipment.type}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Localisation</div>
              <div className="flex items-center text-foreground">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {equipment.location}
              </div>
            </div>

            {equipment.parent && (
              <>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Équipement parent</div>
                  <div className="flex items-center text-foreground">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {equipment.parent}
                  </div>
                </div>
                <div></div>
              </>
            )}
          </div>

          {/* Séparateur */}
          <div className="border-t border-border mb-6"></div>

          {/* Deuxième groupe d'informations */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Statut</div>
              <StatusBadge 
                status={equipment.active ? 'success' : 'danger'} 
                label={equipment.active ? 'Actif' : 'Inactif'} 
              />
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">État</div>
              <StatusBadge 
                status={equipment.status === 'operational' ? 'success' : 'warning'} 
                label={equipment.status === 'operational' ? 'Opérationnel' : 'Maintenance requise'} 
              />
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Dernière maintenance</div>
              <div className="flex items-center text-foreground">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                {equipment.lastMaintenance}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Prochaine maintenance</div>
              <div className="flex items-center text-foreground">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {equipment.nextMaintenance}
              </div>
            </div>
          </div>
        </Card>

        {/* Associated Children */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Équipements enfants</h2>
          <div className="rounded-md border max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Référence externe</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockChildren.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell className="font-medium">{child.name}</TableCell>
                    <TableCell>{child.externalRef}</TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={child.status === 'operational' ? 'success' : 'warning'} 
                        label={child.status === 'operational' ? 'Opérationnel' : 'Maintenance requise'} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Documents additionnels</h2>
            <Button size="sm">
              Ajouter
            </Button>
          </div>
          <div className="space-y-2">
            {mockDocuments.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-3 hover:bg-accent/30 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground truncate">{doc.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {doc.uploadedBy} • {doc.uploadedAt}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
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
      </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Historique des modifications</h2>
            <div className="space-y-3">
              {mockHistory.map((entry) => (
                <div 
                  key={entry.id}
                  className="flex items-start gap-3 p-3 hover:bg-accent/30 rounded-lg transition-colors"
                >
                  {/* Avatar with initials */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {entry.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">{entry.user}</span>
                          {' '}a mis à jour{' '}
                          <span className="font-semibold text-foreground">{entry.field}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-muted-foreground line-through">{entry.oldValue}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground font-medium">{entry.newValue}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{entry.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="mt-0">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Liste des Interventions</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Équipement</TableHead>
                    <TableHead>Gamme</TableHead>
                    <TableHead>Attribué à</TableHead>
                    <TableHead>Date planifiée</TableHead>
                    <TableHead>Date réalisée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInterventions.map((intervention) => (
                    <TableRow key={intervention.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">{intervention.number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{intervention.equipmentName}</div>
                          <div className="text-sm text-muted-foreground">ID: {intervention.equipmentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{intervention.gamme}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-foreground">{intervention.assignedTo}</div>
                          {intervention.assignedEmail && (
                            <div className="text-sm text-muted-foreground">{intervention.assignedEmail}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {intervention.plannedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {intervention.completedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge 
                          status={intervention.status === 'completed' ? 'success' : 'info'} 
                          label={intervention.status === 'completed' ? 'Terminé' : 'Planifié'} 
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Détails
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentDetail;
