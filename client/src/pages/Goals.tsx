import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useExpense } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  completed: boolean;
}

export default function Goals() {
  const { getTotalIncome, getTotalExpenses } = useExpense();
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  });

  // Salvar goals no localStorage
  React.useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      toast.error('Preencha todos os campos');
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      deadline: formData.deadline,
      completed: false,
    };

    setGoals([...goals, newGoal]);
    setFormData({
      name: '',
      targetAmount: '',
      deadline: '',
    });
    setIsOpen(false);
    toast.success('Objetivo criado!');
  };

  const handleAddAmount = (goalId: string, amount: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = goal.currentAmount + amount;
        return {
          ...goal,
          currentAmount: Math.min(newAmount, goal.targetAmount),
          completed: newAmount >= goal.targetAmount,
        };
      }
      return goal;
    }));
    toast.success('Valor adicionado!');
  };

  const balance = getTotalIncome() - getTotalExpenses();
  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display text-foreground">Objetivos Financeiros</h1>
            <p className="text-muted-foreground mt-2">Defina e acompanhe seus objetivos de poupança</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Objetivo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Objetivo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Objetivo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Viagem para Paris"
                  />
                </div>
                <div>
                  <Label htmlFor="targetAmount">Valor Alvo (R$)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Prazo</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Criar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Saldo Disponível</p>
              <p className={`text-3xl font-display ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {balance.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Objetivos Ativos</p>
              <p className="text-3xl font-display text-blue-600">{activeGoals.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Objetivos Concluídos</p>
              <p className="text-3xl font-display text-green-600">{completedGoals.length}</p>
            </div>
          </div>
        </Card>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-heading mb-4">Objetivos em Andamento</h2>
            <div className="space-y-4">
              {activeGoals.map(goal => {
                const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                const daysLeft = Math.ceil(
                  (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <Card key={goal.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-heading">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')} ({daysLeft} dias)
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setGoals(goals.filter(g => g.id !== goal.id));
                          toast.success('Objetivo deletado!');
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">R$ {goal.currentAmount.toFixed(2)}</span>
                        <span className="text-sm">R$ {goal.targetAmount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-green-600 transition-all"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{percentage.toFixed(0)}% concluído</p>
                    </div>

                    {/* Quick Add Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddAmount(goal.id, 50)}
                      >
                        +R$ 50
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddAmount(goal.id, 100)}
                      >
                        +R$ 100
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddAmount(goal.id, 500)}
                      >
                        +R$ 500
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-2xl font-heading mb-4">Objetivos Concluídos</h2>
            <div className="space-y-4">
              {completedGoals.map(goal => (
                <Card key={goal.id} className="p-6 bg-green-50 dark:bg-green-950/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="text-lg font-heading">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Concluído em: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setGoals(goals.filter(g => g.id !== goal.id));
                        toast.success('Objetivo deletado!');
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum objetivo criado ainda</p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
