import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
}

export interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  getExpensesByCategory: (category: string) => Expense[];
  getTotalExpenses: () => number;
  getTotalIncome: () => number;
  getBalance: () => number;
  getExpensesByMonth: (month: string) => Expense[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error('Erro ao carregar despesas:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([newExpense, ...expenses]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const updateExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    setExpenses(expenses.map(exp => (exp.id === id ? { ...expense, id } : exp)));
  };

  const getExpensesByCategory = (category: string) => {
    return expenses.filter(exp => exp.category === category);
  };

  const getTotalExpenses = () => {
    return expenses
      .filter(exp => exp.type === 'expense')
      .reduce((total, exp) => total + exp.amount, 0);
  };

  const getTotalIncome = () => {
    return expenses
      .filter(exp => exp.type === 'income')
      .reduce((total, exp) => total + exp.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getExpensesByMonth = (month: string) => {
    return expenses.filter(exp => exp.date.startsWith(month));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        getExpensesByCategory,
        getTotalExpenses,
        getTotalIncome,
        getBalance,
        getExpensesByMonth,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense deve ser usado dentro de ExpenseProvider');
  }
  return context;
};
