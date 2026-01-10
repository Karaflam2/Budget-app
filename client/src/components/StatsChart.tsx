import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface StatsChartProps {
  type: 'bar' | 'line' | 'pie';
  data: any[];
  dataKey: string;
  title: string;
  colors?: string[];
  height?: number;
}

function StatsChart({
  type,
  data,
  dataKey,
  title,
  colors = ['#3B82F6', '#10B981', '#EF4444'],
  height = 300
}: StatsChartProps) {
  // ✅ ÉTAPE 1: Valider les données
  if (!data || data.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-500">Pas de données à afficher</p>
      </div>
    );
  }

  // Formatter sécurisé pour les valeurs
  const formatValue = (value: any) => {
    const num = typeof value === 'number' ? value : parseFloat(value);
    return !isNaN(num) ? `${num.toFixed(2)}€` : `${value}`;
  };

  // ✅ ÉTAPE 2: Rendu conditionnel basé sur le type
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={formatValue} />
            <Legend />
            <Bar dataKey={dataKey} fill={colors[0]} radius={[8, 8, 0, 0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={formatValue} />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0], r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={formatValue} />
            <Legend />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

export default StatsChart;