import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Wrench,
  MapPin,
  Camera,
  MessageSquare,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  Plus,
  Image
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Données de démonstration
const interventionData: Record<string, {
  id: string;
  equipment: string;
  equipmentCode: string;
  location: string;
  gamme: string;
  description: string;
  assignedTo: string;
  plannedDate: string;
  plannedTime: string;
  status: string;
  priority: string;
  tasks: { id: string; label: string; completed: boolean }[];
  comments: { user: string; date: string; text: string }[];
  photos: string[];
}> = {
  'INT001': {
    id: 'INT001',
    equipment: 'Oléoserveur 201',
    equipmentCode: 'EQ001',
    location: 'Zone A - Bâtiment principal',
    gamme: 'Maintenance préventive mensuelle',
    description: 'Vérification complète du système oléohydraulique incluant le contrôle des niveaux, la vérification des connexions et le test des capteurs.',
    assignedTo: 'Jean Martin',
    plannedDate: '04/12/2025',
    plannedTime: '08:00',
    status: 'completed',
    priority: 'medium',
    tasks: [
      { id: 't1', label: 'Vérifier le niveau d\'huile', completed: true },
      { id: 't2', label: 'Contrôler les connexions électriques', completed: true },
      { id: 't3', label: 'Tester les capteurs de pression', completed: true },
      { id: 't4', label: 'Nettoyer les filtres', completed: true },
      { id: 't5', label: 'Vérifier l\'étanchéité', completed: false },
    ],
    comments: [
      { user: 'Jean Martin', date: '04/12/2025 08:45', text: 'Niveau d\'huile conforme, légère fuite détectée sur raccord B2.' },
    ],
    photos: []
  },
  'INT002': {
    id: 'INT002',
    equipment: 'Pompe principale Zone A',
    equipmentCode: 'EQ015',
    location: 'Zone A - Station de pompage',
    gamme: 'Contrôle visuel',
    description: 'Inspection visuelle de la pompe principale pour détecter tout signe d\'usure ou de dysfonctionnement.',
    assignedTo: 'Jean Martin',
    plannedDate: '04/12/2025',
    plannedTime: '10:30',
    status: 'in-progress',
    priority: 'high',
    tasks: [
      { id: 't1', label: 'Inspecter les joints', completed: true },
      { id: 't2', label: 'Vérifier les vibrations', completed: false },
      { id: 't3', label: 'Contrôler la température', completed: false },
      { id: 't4', label: 'Vérifier les fixations', completed: false },
    ],
    comments: [],
    photos: []
  },
  'INT003': {
    id: 'INT003',
    equipment: 'Compteur Zone 1',
    equipmentCode: 'EQ008',
    location: 'Zone 1 - Point de distribution',
    gamme: 'Calibration',
    description: 'Calibration du compteur de débit selon les procédures standards.',
    assignedTo: 'Jean Martin',
    plannedDate: '04/12/2025',
    plannedTime: '14:00',
    status: 'planned',
    priority: 'medium',
    tasks: [
      { id: 't1', label: 'Préparer l\'équipement de calibration', completed: false },
      { id: 't2', label: 'Effectuer les mesures', completed: false },
      { id: 't3', label: 'Ajuster les paramètres', completed: false },
      { id: 't4', label: 'Valider la calibration', completed: false },
    ],
    comments: [],
    photos: []
  },
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return { label: 'Terminé', icon: CheckCircle2, className: 'bg-green-100 text-green-800' };
    case 'in-progress':
      return { label: 'En cours', icon: PlayCircle, className: 'bg-blue-100 text-blue-800' };
    case 'late':
      return { label: 'En retard', icon: AlertCircle, className: 'bg-red-100 text-red-800' };
    default:
      return { label: 'Planifié', icon: Clock, className: 'bg-gray-100 text-gray-800' };
  }
};

const TabletInterventionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const intervention = id ? interventionData[id] : null;
  const [tasks, setTasks] = useState(intervention?.tasks || []);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(intervention?.comments || []);

  if (!intervention) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-4">Intervention introuvable</h2>
        <Button onClick={() => navigate('/tablet')}>Retour à l'accueil</Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(intervention.status);
  const StatusIcon = statusConfig.icon;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedTasks / tasks.length) * 100);

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    const newComment = {
      user: 'Jean Martin',
      date: new Date().toLocaleString('fr-FR'),
      text: comment
    };
    setComments([...comments, newComment]);
    setComment('');
    toast({ title: "Commentaire ajouté" });
  };

  const handleTakePhoto = () => {
    toast({ 
      title: "Fonction photo",
      description: "La prise de photo sera disponible sur l'application native"
    });
  };

  const handleStartIntervention = () => {
    toast({ title: "Intervention démarrée", description: "Le chronomètre est lancé" });
  };

  const handleCompleteIntervention = () => {
    toast({ title: "Intervention terminée", description: "Les données ont été enregistrées" });
  };

  return (
    <div className="p-4 pb-8 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12"
          onClick={() => navigate('/tablet')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{intervention.equipment}</h1>
          <p className="text-sm text-muted-foreground">{intervention.id}</p>
        </div>
        <Badge className={cn("text-sm px-3 py-1", statusConfig.className)}>
          <StatusIcon className="h-4 w-4 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>

      {/* Informations générales */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Wrench className="h-5 w-5 text-muted-foreground" />
          <span className="text-foreground">{intervention.gamme}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span className="text-foreground">{intervention.location}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-foreground">{intervention.plannedDate} à {intervention.plannedTime}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="text-foreground">{intervention.assignedTo}</span>
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">{intervention.description}</p>
        </div>
      </Card>

      {/* Actions rapides */}
      {intervention.status !== 'completed' && (
        <div className="flex gap-3">
          {intervention.status === 'planned' && (
            <Button 
              className="flex-1 h-14 text-base"
              onClick={handleStartIntervention}
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Démarrer l'intervention
            </Button>
          )}
          {intervention.status === 'in-progress' && (
            <Button 
              className="flex-1 h-14 text-base bg-green-600 hover:bg-green-700"
              onClick={handleCompleteIntervention}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Terminer l'intervention
            </Button>
          )}
        </div>
      )}

      {/* Progression des tâches */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Tâches à réaliser</h2>
          <span className="text-sm text-muted-foreground">{completedTasks}/{tasks.length}</span>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg active:bg-muted/50 cursor-pointer"
              onClick={() => handleTaskToggle(task.id)}
            >
              <Checkbox 
                checked={task.completed}
                className="h-6 w-6"
              />
              <span className={cn(
                "flex-1 text-base",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Photos et commentaires */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Photos & Commentaires</h2>
          <Button variant="outline" size="sm" onClick={handleTakePhoto}>
            <Camera className="h-4 w-4 mr-2" />
            Prendre photo
          </Button>
        </div>

        {/* Zone de commentaire */}
        <div className="space-y-3">
          <Textarea
            placeholder="Ajouter un commentaire..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] text-base"
          />
          <Button 
            onClick={handleAddComment} 
            disabled={!comment.trim()}
            className="w-full h-12"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Ajouter le commentaire
          </Button>
        </div>

        {/* Liste des commentaires */}
        {comments.length > 0 && (
          <div className="mt-4 space-y-3 pt-4 border-t border-border">
            {comments.map((c, index) => (
              <div key={index} className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">{c.user}</span>
                  <span className="text-muted-foreground">{c.date}</span>
                </div>
                <p className="text-sm text-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Bouton diagnostic */}
      <Button 
        variant="outline" 
        className="w-full h-14 text-base"
        onClick={() => navigate(`/tablet/diagnostic?equipment=${intervention.equipmentCode}&intervention=${intervention.id}`)}
      >
        <Plus className="h-5 w-5 mr-2" />
        Ajouter un diagnostic / anomalie
      </Button>
    </div>
  );
};

export default TabletInterventionDetail;
