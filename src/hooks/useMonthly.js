import { useState, useEffect } from "react";

export function useMonthly() {
  const [monthlyData, setMonthlyData] = useState({
    0: {
      expenses: [],
      income: [],
      budget: 2000,
    },
  });
  const [currentMonth, setCurrentMonth] = useState(0);
  const [showMonthlyExpenseForm, setShowMonthlyExpenseForm] = useState(false);
  const [showMonthlyIncomeForm, setShowMonthlyIncomeForm] = useState(false);
  const [newMonthlyExpense, setNewMonthlyExpense] = useState({
    name: "",
    amount: "",
    planned: true,
  });
  const [newMonthlyIncome, setNewMonthlyIncome] = useState({
    source: "",
    amount: "",
  });

  useEffect(() => {
    const savedMonthlyData = localStorage.getItem("aiAssistant_monthlyData");
    if (savedMonthlyData) setMonthlyData(JSON.parse(savedMonthlyData));
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "aiAssistant_monthlyData",
      JSON.stringify(monthlyData)
    );
  }, [monthlyData]);

  const getCurrentMonthData = () => {
    return (
      monthlyData[currentMonth] || {
        expenses: [],
        income: [],
        budget: 2000,
      }
    );
  };
  const updateMonthlyData = (updates) => {
    setMonthlyData((prev) => ({
      ...prev,
      [currentMonth]: {
        ...getCurrentMonthData(),
        ...updates,
      },
    }));
  };
  const monthlyExpenses = getCurrentMonthData().expenses;
  const monthlyIncome = getCurrentMonthData().income;
  const monthlyBudget = getCurrentMonthData().budget;

  const addMonthlyIncome = () => {
    if (!newMonthlyIncome.source?.trim() || !newMonthlyIncome.amount) return;
    const income = {
      id: Date.now(),
      source: newMonthlyIncome.source.trim(),
      amount: parseFloat(newMonthlyIncome.amount) || 0,
      received: false,
    };
    updateMonthlyData({ income: [...monthlyIncome, income] });
    setNewMonthlyIncome({ source: "", amount: "" });
    setShowMonthlyIncomeForm(false);
  };

  const addMonthlyExpense = () => {
    if (!newMonthlyExpense.name?.trim() || !newMonthlyExpense.amount) return;
    const expense = {
      id: Date.now(),
      name: newMonthlyExpense.name.trim(),
      amount: parseFloat(newMonthlyExpense.amount) || 0,
      planned: Boolean(newMonthlyExpense.planned),
      paid: false,
    };
    updateMonthlyData({ expenses: [...monthlyExpenses, expense] });
    setNewMonthlyExpense({ name: "", amount: "", planned: true });
    setShowMonthlyExpenseForm(false);
  };

  const updateMonthlyExpensePaid = (expenseId, paid) => {
    const updatedExpenses = monthlyExpenses.map((exp) =>
      exp?.id === expenseId ? { ...exp, paid: Boolean(paid) } : exp
    );
    updateMonthlyData({ expenses: updatedExpenses });
  };

  const updateMonthlyIncomeReceived = (incomeId, received) => {
    const updatedIncome = monthlyIncome.map((inc) =>
      inc?.id === incomeId ? { ...inc, received: Boolean(received) } : inc
    );
    updateMonthlyData({ income: updatedIncome });
  };

  const monthlyExpensesTotal = (monthlyExpenses || [])
    .filter((e) => e?.paid)
    .reduce((sum, e) => sum + (parseFloat(e?.amount) || 0), 0);

  const monthlyIncomePaid = (monthlyIncome || [])
    .filter((i) => i?.received)
    .reduce((sum, i) => sum + (parseFloat(i?.amount) || 0), 0);

  const monthlyIncomeTotal = (monthlyIncome || []).reduce(
    (sum, i) => sum + (parseFloat(i?.amount) || 0),
    0
  );

  return {
    monthlyData,
    setMonthlyData,
    currentMonth,
    setCurrentMonth,
    showMonthlyExpenseForm,
    setShowMonthlyExpenseForm,
    showMonthlyIncomeForm,
    setShowMonthlyIncomeForm,
    newMonthlyExpense,
    setNewMonthlyExpense,
    newMonthlyIncome,
    setNewMonthlyIncome,
    getCurrentMonthData,
    updateMonthlyData,
    monthlyExpenses,
    monthlyIncome,
    monthlyBudget,
    addMonthlyIncome,
    addMonthlyExpense,
    updateMonthlyExpensePaid,
    updateMonthlyIncomeReceived,
    monthlyExpensesTotal,
    monthlyIncomePaid,
    monthlyIncomeTotal,
  };
}