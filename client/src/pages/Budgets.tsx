import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { useExpense } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'food', label: 'Alimentação' },
  { value: 'transport', label: 'Transporte' },
  { value: 'entertainment', label: 'Entretenimento' },
  { value: 'utilities', label: 'Utilidades' },
  { value: 'shopping', label: 'Compras' },
  { value: 'other', label: 'Outros' },
];

interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string;
}

export default function Budgets() {
  const { expenses } = useExpense();
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'food',
    limit: '',
    month: new Date().toISOString().slice(0, 7),
  });

  // Salvar budgets no localStorage
  React.useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.limit) {
      toast.error('Preencha o limite');
      return;
    }

    const newBudget: Budget = {
      id: Date.now().toString(),
      category: formData.category,
      limit: parseFloat(formData.limit),
      month: formData.month,
    };

    setBudgets([...budgets, newBudget]);
    setFormData({
      category: 'food',
      limit: '',
      month: new Date().toISOString().slice(0, 7),
    });
    setIsOpen(false);
    toast.success('Orçamento criado!');
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentBudgets = budgets.filter(b => b.month === currentMonth);

  // Calcular gastos por categoria para o mês atual
  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    expenses
      .filter(exp => exp.type === 'expense' && exp.date.startsWith(currentMonth))
      .forEach(exp => {
        spending[exp.category] = (spending[exp.category] || 0) + exp.amount;
      });
    return spending;
  }, [expenses, currentMonth]);

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'ok';
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display text-foreground">Orçamentos</h1>
            <p className="text-muted-foreground mt-2">Defina limites para suas despesas</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Orçamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="limit">Limite (R$)</Label>
                  <Input
                    id="limit"
                    type="number"
                    step="0.01"
                    value={formData.limit}
                    onChange={e => setFormData({ ...formData, limit: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="month">Mês</Label>
                  <Input
                    id="month"
                    type="month"
                    value={formData.month}
                    onChange={e => setFormData({ ...formData, month: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Criar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Month Budgets */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading mb-4">
            {new Date(currentMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          {currentBudgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentBudgets.map(budget => {
                const spent = categorySpending[budget.category] || 0;
                const percentage = (spent / budget.limit) * 100;
                const status = getBudgetStatus(spent, budget.limit);
                const categoryName = CATEGORIES.find(c => c.value === budget.category)?.label || budget.category;

                return (
                  <Card key={budget.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-heading">{categoryName}</h3>
                        <p className="text-sm text-muted-foreground">
                          R$ {spent.toFixed(2)} de R$ {budget.limit.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setBudgets(budgets.filter(b => b.id !== budget.id));
                          toast.success('Orçamento deletado!');
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            status === 'exceeded'
                              ? 'bg-red-600'
                              : status === 'warning'
                                ? 'bg-yellow-500'
                                : 'bg-green-600'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          status === 'exceeded'
                            ? 'bg-red-100 text-red-700'
                            : status === 'warning'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {status === 'exceeded'
                          ? 'Excedido'
                          : status === 'warning'
                            ? 'Atenção'
                            : 'No controle'}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum orçamento criado para este mês</p>
            </Card>
          )}
        </div>

        {/* All Budgets */}
        {budgets.length > currentBudgets.length && (
          <div>
            <h2 className="text-2xl font-heading mb-4">Orçamentos Anteriores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgets
                .filter(b => b.month !== currentMonth)
                .map(budget => {
                  const spent = categorySpending[budget.category] || 0;
                  const categoryName = CATEGORIES.find(c => c.value === budget.category)?.label || budget.category;

                  return (
                    <Card key={budget.id} className="p-6 opacity-75">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-heading">{categoryName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(budget.month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-sm mt-2">
                            R$ {spent.toFixed(2)} de R$ {budget.limit.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setBudgets(budgets.filter(b => b.id !== budget.id));
                            toast.success('Orçamento deletado!');
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
