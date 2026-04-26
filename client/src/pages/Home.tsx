import React, { useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { useExpense } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Plus, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'food', label: 'Alimentação', color: '#ef4444' },
  { value: 'transport', label: 'Transporte', color: '#f59e0b' },
  { value: 'entertainment', label: 'Entretenimento', color: '#8b5cf6' },
  { value: 'utilities', label: 'Utilidades', color: '#06b6d4' },
  { value: 'shopping', label: 'Compras', color: '#ec4899' },
  { value: 'salary', label: 'Salário', color: '#10b981' },
  { value: 'other', label: 'Outros', color: '#6b7280' },
];

export default function Home() {
  const { expenses, addExpense, getTotalExpenses, getTotalIncome, getBalance } = useExpense();
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    description: '',
    amount: '',
    category: 'food',
    type: 'expense' as 'expense' | 'income',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      toast.error('Preencha todos os campos');
      return;
    }
    addExpense({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date,
    });
    setFormData({
      description: '',
      amount: '',
      category: 'food',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    });
    setIsOpen(false);
    toast.success('Despesa adicionada com sucesso!');
  };

  const totalExpenses = getTotalExpenses();
  const totalIncome = getTotalIncome();
  const balance = getBalance();

  // Dados para gráfico de pizza
  const categoryData = useMemo(() => {
    const grouped: Record<string, number> = {};
    expenses
      .filter(exp => exp.type === 'expense')
      .forEach(exp => {
        grouped[exp.category] = (grouped[exp.category] || 0) + exp.amount;
      });
    return Object.entries(grouped).map(([category, amount]) => ({
      name: CATEGORIES.find(c => c.value === category)?.label || category,
      value: amount,
      color: CATEGORIES.find(c => c.value === category)?.color || '#6b7280',
    }));
  }, [expenses]);

  // Dados para gráfico de linha (últimos 7 dias)
  const lineChartData = useMemo(() => {
    const last7Days: Record<string, { income: number; expense: number }> = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days[dateStr] = { income: 0, expense: 0 };
    }

    expenses.forEach(exp => {
      if (last7Days[exp.date]) {
        if (exp.type === 'income') {
          last7Days[exp.date].income += exp.amount;
        } else {
          last7Days[exp.date].expense += exp.amount;
        }
      }
    });

    return Object.entries(last7Days).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      income: data.income,
      expense: data.expense,
    }));
  }, [expenses]);

  const recentExpenses = expenses.slice(0, 5);

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display text-foreground">Visão Geral</h1>
            <p className="text-muted-foreground mt-2">Acompanhe suas finanças em tempo real</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Transação</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Despesa</SelectItem>
                      <SelectItem value="income">Renda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Almoço"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Adicionar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Total</p>
                <p className={`text-3xl font-display ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {balance.toFixed(2)}
                </p>
              </div>
              <Wallet className={`w-12 h-12 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Renda Total</p>
                <p className="text-3xl font-display text-green-600">R$ {totalIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Despesas Totais</p>
                <p className="text-3xl font-display text-red-600">R$ {totalExpenses.toFixed(2)}</p>
              </div>
              <TrendingDown className="w-12 h-12 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-heading mb-4">Despesas por Categoria</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
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
                Nenhuma despesa registrada
              </div>
            )}
          </Card>

          {/* Line Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-heading mb-4">Últimos 7 Dias</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" name="Renda" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Despesa" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h2 className="text-xl font-heading mb-4">Transações Recentes</h2>
          {recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map(exp => (
                <div key={exp.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{exp.description}</p>
                    <p className="text-sm text-muted-foreground">{exp.category}</p>
                  </div>
                  <p className={`font-display ${exp.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {exp.type === 'income' ? '+' : '-'} R$ {exp.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhuma transação registrada</p>
          )}
        </Card>
      </div>
    </Layout>
  );
}
