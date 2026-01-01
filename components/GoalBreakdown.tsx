"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface BreakdownProps {
  data: { name: string; minutes: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function GoalBreakdown({ data }: BreakdownProps) {
  return (
    <div style={{ width: '100%', height: 300 }}>
        {data.length === 0 ? (
             <div className="flex items-center justify-center h-full text-gray-500">
                Complete a Pomodoro session to see data here.
            </div>
        ) : (
            <ResponsiveContainer>
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="minutes"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#2A323C', borderRadius: '0.5rem' }} />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
        )}
    </div>
  );
}