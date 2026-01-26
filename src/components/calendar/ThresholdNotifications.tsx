import React, { useState } from 'react';
import { Bell, X, AlertTriangle, AlertCircle, Gauge, Clock, Droplets, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export type NotificationLevel = 'mini' | 'maxi';
export type ReferentialType = 'kilometres' | 'temps' | 'litrage';

export interface ThresholdNotification {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCode: string;
  gammeId: string;
  gammeName: string;
  gammeCode: string;
  referentialType: ReferentialType;
  thresholdLevel: NotificationLevel;
  thresholdValue: number;
  currentValue: number;
  unit: string;
  detectionDate: Date;
  isAcknowledged: boolean;
}

interface ThresholdNotificationsProps {
  notifications: ThresholdNotification[];
  onNotificationClick: (notification: ThresholdNotification) => void;
  onDismiss?: (notificationId: string) => void;
}

const getReferentialIcon = (type: ReferentialType) => {
  switch (type) {
    case 'kilometres':
      return <Gauge className="h-4 w-4" />;
    case 'temps':
      return <Clock className="h-4 w-4" />;
    case 'litrage':
      return <Droplets className="h-4 w-4" />;
  }
};

const getReferentialLabel = (type: ReferentialType) => {
  switch (type) {
    case 'kilometres':
      return 'Kilomètres';
    case 'temps':
      return 'Temps moteur';
    case 'litrage':
      return 'Litrage';
  }
};

export const ThresholdNotifications: React.FC<ThresholdNotificationsProps> = ({
  notifications,
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const unacknowledgedCount = notifications.filter(n => !n.isAcknowledged).length;
  const maxiAlerts = notifications.filter(n => n.thresholdLevel === 'maxi' && !n.isAcknowledged);
  const hasMaxiAlert = maxiAlerts.length > 0;

  // Trier par date (plus récentes en premier)
  const sortedNotifications = [...notifications]
    .filter(n => !n.isAcknowledged)
    .sort((a, b) => b.detectionDate.getTime() - a.detectionDate.getTime());

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`relative ${hasMaxiAlert ? 'border-red-300 hover:border-red-400' : ''}`}
        >
          <Bell className={`h-4 w-4 ${hasMaxiAlert ? 'text-red-500' : ''}`} />
          {unacknowledgedCount > 0 && (
            <span className={`absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center text-white ${
              hasMaxiAlert ? 'bg-red-500' : 'bg-orange-500'
            }`}>
              {unacknowledgedCount > 9 ? '9+' : unacknowledgedCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alertes de seuils
            </h3>
            <Badge variant="secondary" className="text-xs">
              {unacknowledgedCount} non traité{unacknowledgedCount > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        <ScrollArea className="max-h-[400px]">
          {sortedNotifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune alerte de seuil</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-accent/50 cursor-pointer transition-colors ${
                    notification.thresholdLevel === 'maxi' ? 'bg-red-50/50' : ''
                  }`}
                  onClick={() => {
                    onNotificationClick(notification);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icône d'alerte */}
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      notification.thresholdLevel === 'maxi' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {notification.thresholdLevel === 'maxi' 
                        ? <AlertTriangle className="h-4 w-4" /> 
                        : <AlertCircle className="h-4 w-4" />
                      }
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium text-sm ${
                          notification.thresholdLevel === 'maxi' ? 'text-red-700' : 'text-foreground'
                        }`}>
                          {notification.equipmentName}
                        </span>
                        <Badge 
                          className={`text-[10px] px-1.5 py-0 ${
                            notification.thresholdLevel === 'maxi'
                              ? 'bg-red-100 text-red-700 hover:bg-red-100'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                          }`}
                        >
                          Seuil {notification.thresholdLevel === 'maxi' ? 'MAX' : 'MIN'}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground mb-1.5">
                        Gamme: <span className="font-medium">{notification.gammeName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs mb-1.5">
                        <span className={notification.thresholdLevel === 'maxi' ? 'text-red-600' : 'text-orange-600'}>
                          {getReferentialIcon(notification.referentialType)}
                        </span>
                        <span className="text-muted-foreground">
                          {getReferentialLabel(notification.referentialType)}:
                        </span>
                        <span className={`font-medium ${
                          notification.thresholdLevel === 'maxi' ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {notification.currentValue.toLocaleString('fr-FR')} {notification.unit}
                        </span>
                        <span className="text-muted-foreground">
                          (seuil: {notification.thresholdValue.toLocaleString('fr-FR')} {notification.unit})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Détecté le {format(notification.detectionDate, "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {sortedNotifications.length > 0 && (
          <div className="p-2 border-t border-border bg-muted/30">
            <p className="text-[10px] text-muted-foreground text-center">
              Cliquez sur une alerte pour créer une intervention
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};