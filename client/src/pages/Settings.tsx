import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [settings, setSettings] = React.useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : { currency: 'BRL', theme: 'light', notifications: true };
  });

  React.useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const handleExportData = () => {
    const expenses = localStorage.getItem('expenses') || '[]';
    const budgets = localStorage.getItem('budgets') || '[]';
    const goals = localStorage.getItem('goals') || '[]';

    const data = {
      expenses: JSON.parse(expenses),
      budgets: JSON.parse(budgets),
      goals: JSON.parse(goals),
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Dados exportados com sucesso!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        localStorage.setItem('expenses', JSON.stringify(data.expenses || []));
        localStorage.setItem('budgets', JSON.stringify(data.budgets || []));
        localStorage.setItem('goals', JSON.stringify(data.goals || []));
        toast.success('Dados importados com sucesso!');
        window.location.reload();
      } catch (error) {
        toast.error('Erro ao importar dados');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('Tem certeza que deseja deletar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('expenses');
      localStorage.removeItem('budgets');
      localStorage.removeItem('goals');
      toast.success('Todos os dados foram deletados');
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-2">Personalize sua experiência</p>
        </div>

        {/* General Settings */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-heading mb-6">Preferências Gerais</h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="currency">Moeda</Label>
              <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                  <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theme">Tema</Label>
              <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações</Label>
                <p className="text-sm text-muted-foreground">Receber alertas de orçamento</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-heading mb-6">Gerenciamento de Dados</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-heading mb-2">Exportar Dados</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Baixe um backup de todos os seus dados em formato JSON
              </p>
              <Button onClick={handleExportData} className="gap-2">
                <Download className="w-4 h-4" />
                Exportar Dados
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-heading mb-2">Importar Dados</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Restaure dados de um backup anterior
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-file"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-file')?.click()}
              >
                Importar Dados
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200 dark:border-red-900">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-heading mb-2 text-red-600">Zona de Perigo</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Estas ações são permanentes e não podem ser desfeitas
              </p>
              <Button
                variant="destructive"
                onClick={handleClearAllData}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Deletar Todos os Dados
              </Button>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6 mt-6 bg-muted">
          <h2 className="text-2xl font-heading mb-4">Sobre</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-heading">ExpenseTracker</span> v1.0.0
            </p>
            <p className="text-muted-foreground">
              Um rastreador de despesas moderno e intuitivo para ajudar você a gerenciar suas finanças pessoais.
            </p>
            <p className="text-muted-foreground">
              Todos os seus dados são armazenados localmente no seu navegador. Nenhuma informação é enviada para servidores externos.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
