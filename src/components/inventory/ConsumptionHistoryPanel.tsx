 import React from 'react';
 import { Card } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { 
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import { TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface ConsumptionRecord {
   id: string;
   date: string;
   type: 'consumption' | 'entry' | 'adjustment';
   quantity: number;
   interventionId?: string;
   interventionTitle?: string;
   operator: string;
   notes?: string;
 }
 
 interface ConsumptionHistoryPanelProps {
   partId: string;
   partName: string;
   records: ConsumptionRecord[];
 }
 
 export const ConsumptionHistoryPanel: React.FC<ConsumptionHistoryPanelProps> = ({
   partId,
   partName,
   records,
 }) => {
   const totalConsumed = records
     .filter(r => r.type === 'consumption')
     .reduce((sum, r) => sum + Math.abs(r.quantity), 0);
   
   const totalEntered = records
     .filter(r => r.type === 'entry')
     .reduce((sum, r) => sum + r.quantity, 0);
 
   return (
     <div className="space-y-4">
       <div className="flex items-center justify-between">
         <div>
           <h3 className="font-semibold text-lg">{partName}</h3>
           <p className="text-sm text-muted-foreground">Historique des mouvements</p>
         </div>
         <Badge variant="outline" className="font-mono">{partId}</Badge>
       </div>
 
       {/* Stats */}
       <div className="grid grid-cols-3 gap-3">
         <Card className="p-3">
           <div className="flex items-center gap-2 text-muted-foreground mb-1">
             <TrendingDown className="h-4 w-4 text-red-500" />
             <span className="text-xs">Consommé</span>
           </div>
           <div className="text-xl font-bold text-red-600">-{totalConsumed}</div>
         </Card>
         <Card className="p-3">
           <div className="flex items-center gap-2 text-muted-foreground mb-1">
             <TrendingUp className="h-4 w-4 text-green-500" />
             <span className="text-xs">Entrées</span>
           </div>
           <div className="text-xl font-bold text-green-600">+{totalEntered}</div>
         </Card>
         <Card className="p-3">
           <div className="flex items-center gap-2 text-muted-foreground mb-1">
             <ArrowRight className="h-4 w-4" />
             <span className="text-xs">Mouvements</span>
           </div>
           <div className="text-xl font-bold">{records.length}</div>
         </Card>
       </div>
 
       {/* Tableau */}
       <Card className="overflow-hidden">
         <Table>
           <TableHeader>
             <TableRow className="bg-muted/50">
               <TableHead className="w-24">Date</TableHead>
               <TableHead className="w-28">Type</TableHead>
               <TableHead className="w-20 text-right">Qté</TableHead>
               <TableHead>Intervention liée</TableHead>
               <TableHead>Opérateur</TableHead>
               <TableHead>Notes</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {records.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                   Aucun mouvement enregistré
                 </TableCell>
               </TableRow>
             ) : (
               records.map((record) => (
                 <TableRow key={record.id}>
                   <TableCell className="text-sm">{record.date}</TableCell>
                   <TableCell>
                     <Badge 
                       className={cn(
                         "text-xs",
                         record.type === 'consumption' && "bg-red-100 text-red-700",
                         record.type === 'entry' && "bg-green-100 text-green-700",
                         record.type === 'adjustment' && "bg-blue-100 text-blue-700"
                       )}
                     >
                       {record.type === 'consumption' && 'Consommation'}
                       {record.type === 'entry' && 'Entrée'}
                       {record.type === 'adjustment' && 'Ajustement'}
                     </Badge>
                   </TableCell>
                   <TableCell className={cn(
                     "text-right font-medium",
                     record.type === 'consumption' ? "text-red-600" : "text-green-600"
                   )}>
                     {record.type === 'consumption' ? '-' : '+'}{Math.abs(record.quantity)}
                   </TableCell>
                   <TableCell>
                     {record.interventionId ? (
                       <a 
                         href={`/interventions/${record.interventionId}`}
                         className="text-primary hover:underline text-sm"
                       >
                         {record.interventionTitle || record.interventionId}
                       </a>
                     ) : (
                       <span className="text-muted-foreground text-sm">-</span>
                     )}
                   </TableCell>
                   <TableCell className="text-sm">{record.operator}</TableCell>
                   <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                     {record.notes || '-'}
                   </TableCell>
                 </TableRow>
               ))
             )}
           </TableBody>
         </Table>
       </Card>
     </div>
   );
 };