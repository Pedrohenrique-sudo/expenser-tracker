import React, { useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { useExpense } from '@/contexts/ExpenseContext';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CATEGORIES = [
  { value: 'food', label: 'Alimentação', color: '#ef4444' },
  { value: 'transport', label: 'Transporte', color: '#f59e0b' },
  { value: 'entertainment', label: 'Entretenimento', color: '#8b5cf6' },
  { value: 'utilities', label: 'Utilidades', color: '#06b6d4' },
  { value: 'shopping', label: 'Compras', color: '#ec4899' },
  { value: 'salary', label: 'Salário', color: '#10b981' },
  { value: 'other', label: 'Outros', color: '#6b7280' },
];

export default function Analytics() {
  const { expenses, getTotalExpenses, getTotalIncome } = useExpense();

  // Dados por categoria
  const categoryData = useMemo(() => {
    const grouped: Record<string, number> = {};
    expenses
      .filter(exp => exp.type === 'expense')
      .forEach(exp => {
        grouped[exp.category] = (grouped[exp.category] || 0) + exp.amount;
      });
    return Object.entries(grouped)
      .map(([category, amount]) => ({
        name: CATEGORIES.find(c => c.value === category)?.label || category,
        value: amount,
        color: CATEGORIES.find(c => c.value === category)?.color || '#6b7280',
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Dados por mês
  const monthlyData = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {};

    expenses.forEach(exp => {
      const month = exp.date.substring(0, 7);
      if (!months[month]) {
        months[month] = { income: 0, expense: 0 };
      }
      if (exp.type === 'income') {
        months[month].income += exp.amount;
      } else {
        months[month].expense += exp.amount;
      }
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        income: data.income,
        expense: data.expense,
      }));
  }, [expenses]);

  // Dados por dia (últimos 30 dias)
  const dailyData = useMemo(() => {
    const days: Record<string, { income: number; expense: number }> = {};
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days[dateStr] = { income: 0, expense: 0 };
    }

    expenses.forEach(exp => {
      if (days[exp.date]) {
        if (exp.type === 'income') {
          days[exp.date].income += exp.amount;
        } else {
          days[exp.date].expense += exp.amount;
        }
      }
    });

    return Object.entries(days)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        income: data.income,
        expense: data.expense,
      }));
  }, [expenses]);

  const totalExpenses = getTotalExpenses();
  const totalIncome = getTotalIncome();

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display text-foreground">Análises</h1>
          <p className="text-muted-foreground mt-2">Visualize seus dados financeiros em detalhes</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-heading mb-4">Resumo</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Renda Total:</span>
                <span className="font-display text-green-600">R$ {totalIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Despesas Totais:</span>
                <span className="font-display text-red-600">R$ {totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-muted-foreground font-medium">Saldo:</span>
                <span className={`font-display ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {(totalIncome - totalExpenses).toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-heading mb-4">Proporção</h3>
            {categoryData.length > 0 ? (
              <div className="space-y-2">
                {categoryData.slice(0, 5).map(cat => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <span className="text-sm font-medium">{((cat.value / totalExpenses) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Sem dados</p>
            )}
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Pie Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-heading mb-4">Despesas por Categoria</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: R$ ${value.toFixed(0)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados
              </div>
            )}
          </Card>

          {/* Category Bar Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-heading mb-4">Ranking de Categorias</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados
              </div>
            )}
          </Card>
        </div>

        {/* Monthly Trend */}
        {monthlyData.length > 0 && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-heading mb-4">Tendência Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" name="Renda" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Despesa" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Daily Trend */}
        {dailyData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-heading mb-4">Últimos 30 Dias</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Renda" />
                <Bar dataKey="expense" fill="#ef4444" name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </Layout>
  );
}
