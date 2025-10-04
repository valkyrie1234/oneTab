import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { StatisticsData } from '../store/storeStatistics';

export interface ChartConfig {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
}

/**
 * Создает конфигурацию графиков для страницы статистики
 * @param statistics - данные статистики
 * @returns массив конфигураций графиков
 */
export const createChartsConfig = (statistics: StatisticsData): ChartConfig[] => {
  return [
    {
      id: 'new-users',
      title: '👤 Новые пользователи (30 дней)',
      icon: '👤',
      component: (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={statistics.newUsersChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D4A574" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#8B5A2B"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#8B5A2B" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#F5E6D3',
                border: '2px solid #8B5A2B',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#8B5A2B" 
              strokeWidth={3}
              name="Новые пользователи"
              dot={{ fill: '#DAA520', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      id: 'tasks-created',
      title: '📝 Созданные задачи (30 дней)',
      icon: '📝',
      component: (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={statistics.tasksChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D4A574" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#8B5A2B"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#8B5A2B" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#F5E6D3',
                border: '2px solid #8B5A2B',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#6B8E23" 
              strokeWidth={3}
              name="Новые задачи"
              dot={{ fill: '#FF8C00', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      id: 'top-users',
      title: '🏆 Топ пользователей по уровню',
      icon: '🏆',
      component: (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={statistics.topUsersByLevel}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D4A574" opacity={0.3} />
            <XAxis 
              dataKey="username" 
              stroke="#8B5A2B"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#8B5A2B" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#F5E6D3',
                border: '2px solid #8B5A2B',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="level" fill="#DAA520" name="Уровень" />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    {
      id: 'user-activity',
      title: '⚡ Активность пользователей (7 дней)',
      icon: '⚡',
      component: (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={statistics.activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D4A574" opacity={0.3} />
            <XAxis 
              dataKey="username" 
              stroke="#8B5A2B"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#8B5A2B" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#F5E6D3',
                border: '2px solid #8B5A2B',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="tasks" fill="#A0522D" name="Задач создано" />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  ];
};
