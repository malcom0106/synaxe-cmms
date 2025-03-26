
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  dataKey: string;
  barColor?: string;
  height?: number;
}

export const SimpleBarChart: React.FC<BarChartProps> = ({ 
  data, 
  dataKey, 
  barColor = "#0070F3",
  height = 200 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          hide={true}
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '8px 12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Bar 
          dataKey={dataKey} 
          fill={barColor} 
          radius={[4, 4, 0, 0]}
          animationDuration={600}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  height?: number;
}

export const SimplePieChart: React.FC<PieChartProps> = ({ 
  data,
  height = 200
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          animationDuration={600}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '8px 12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value: number, name: string) => [`${value}`, name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
