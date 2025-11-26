import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, Truck, MapPin, Calendar, Clock, User, Upload, FileText, Download, Eye } from 'lucide-react';

// Mock data - same structure as Equipment page
const equipmentData = {
  'EQ001': { 
    id: 'EQ001', 
    name: 'Oléoserveur 201', 
    type: 'Oléoserveur', 
    status: 'operational',
    lastMaintenance: '15/04/2023',
    nextMaintenance: '15/06/2023',
    location: 'Zone A'
  },
  'EQ002': { 
    id: 'EQ002', 
    name: 'Oléoserveur 202', 
    type: 'Oléoserveur', 
    status: 'maintenance_required',
    lastMaintenance: '10/03/2023',
    nextMaintenance: '10/05/2023',
    location: 'Zone A'
  },
  'EQ003': { 
    id: 'EQ003', 
    name: 'Oléoserveur 203', 
    type: 'Oléoserveur', 
    status: 'operational',
    lastMaintenance: '20/04/2023',
    nextMaintenance: '20/06/2023',
    location: 'Zone B'
  },
  'EQ004': { 
    id: 'EQ004', 
    name: 'Compteur Zone 1', 
    type: 'Compteur', 
    status: 'operational',
    lastMaintenance: '05/05/2023',
    nextMaintenance: '05/11/2023',
    location: 'Zone 1'
  },
  'EQ005': { 
    id: 'EQ005', 
    name: 'Citerne principale', 
    type: 'Citerne', 
    status: 'operational',
    lastMaintenance: '01/02/2023',
    nextMaintenance: '01/08/2023',
    location: 'Dépôt'
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
  { id: 'EQ-CH-001', name: 'Pompe principale', type: 'Pompe', status: 'operational' },
  { id: 'EQ-CH-002', name: 'Filtre A', type: 'Filtre', status: 'operational' },
  { id: 'EQ-CH-003', name: 'Vanne de sécurité', type: 'Vanne', status: 'maintenance_required' },
  { id: 'EQ-CH-004', name: 'Capteur de pression', type: 'Capteur', status: 'operational' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Equipment info and children */}
        <div className="lg:col-span-1 space-y-6">
          {/* Equipment Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Informations</h2>
            <div className="space-y-4">
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

              <div>
                <div className="text-sm text-muted-foreground mb-1">Statut</div>
                <StatusBadge 
                  status={equipment.status === 'operational' ? 'success' : 'warning'} 
                  label={equipment.status === 'operational' ? 'Opérationnel' : 'Maintenance requise'} 
                />
              </div>
            </div>
          </Card>

          {/* Associated Children */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Composants associés</h2>
            <div className="space-y-3">
              {mockChildren.map((child) => (
                <div 
                  key={child.id}
                  className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-foreground">{child.name}</div>
                    <StatusBadge 
                      status={child.status === 'operational' ? 'success' : 'warning'} 
                      label={child.status === 'operational' ? 'OK' : 'Attention'} 
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">{child.type} - {child.id}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column - Modification history and documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Modification History */}
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

          {/* Documents */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Documents</h2>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {mockDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">{doc.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {doc.size} • {doc.uploadedBy} • {doc.uploadedAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
