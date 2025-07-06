import { useState, useEffect } from "react";
import { getBudgetForWeek } from "../utils/helpers";

export function useBudget() {
  const [weeklyBudgets, setWeeklyBudgets] = useState({
    0: {
      budget: 500,
      categoryLimits: {
        Food: 100,
        Transport: 80,
        Entertainment: 50,
        Shopping: 70,
        Other: 50,
      },
    },
  });
  const [currentWeek, setCurrentWeek] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Food",
  });
  const [newBudget, setNewBudget] = useState({
    budget: "",
    categoryName: "",
    categoryLimit: "",
  });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedExpenses = localStorage.getItem("aiAssistant_expenses");
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    const savedWeeklyBudgets = localStorage.getItem("aiAssistant_weeklyBudgets");
    if (savedWeeklyBudgets) setWeeklyBudgets(JSON.parse(savedWeeklyBudgets));
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    if (isLoaded)
      localStorage.setItem("aiAssistant_expenses", JSON.stringify(expenses));
  }, [expenses, isLoaded]);
  useEffect(() => {
    if (isLoaded)
      localStorage.setItem(
        "aiAssistant_weeklyBudgets",
        JSON.stringify(weeklyBudgets)
      );
  }, [weeklyBudgets, isLoaded]);

  const updateWeeklyBudget = (week, budget) => {
    setWeeklyBudgets((prev) => ({
      ...prev,
      [week]: {
        ...getBudgetForWeek(prev, week),
        budget: parseFloat(budget) || 500,
      },
    }));
  };

  const addCategory = (week, name, limit) => {
    if (!name?.trim()) return;
    setWeeklyBudgets((prev) => ({
      ...prev,
      [week]: {
        ...getBudgetForWeek(prev, week),
        categoryLimits: {
          ...getBudgetForWeek(prev, week).categoryLimits,
          [name]: parseFloat(limit) || 0,
        },
      },
    }));
  };

  const deleteCategory = (week, name) => {
    setWeeklyBudgets((prev) => {
      const newCategoryLimits = { ...getBudgetForWeek(prev, week).categoryLimits };
      delete newCategoryLimits[name];
      return {
        ...prev,
        [week]: {
          ...getBudgetForWeek(prev, week),
          categoryLimits: newCategoryLimits,
        },
      };
    });
  };

  const addExpense = () => {
    if (!newExpense.description?.trim() || !newExpense.amount) return;
    const expense = {
      id: Date.now(),
      description: newExpense.description.trim(),
      amount: parseFloat(newExpense.amount) || 0,
      category: newExpense.category || "Other",
      date: new Date().toLocaleDateString(),
      type: "weekly",
      week: currentWeek,
    };
    setExpenses((prev) => [...prev, expense]);
    setNewExpense({ description: "", amount: "", category: "Food" });
    setShowExpenseForm(false);
  };

  const currentBudget = getBudgetForWeek(weeklyBudgets, currentWeek);
  const currentWeeklyBudget = currentBudget.budget;
  const currentCategoryLimits = currentBudget.categoryLimits;

  const weeklyExpensesTotal = (expenses || [])
    .filter((e) => e?.type === "weekly" && e?.week === currentWeek)
    .reduce((sum, e) => sum + (parseFloat(e?.amount) || 0), 0);

  const remainingWeeklyBudget = currentWeeklyBudget - weeklyExpensesTotal;

  const categorySpending = (expenses || [])
    .filter((e) => e?.week === currentWeek)
    .reduce((acc, expense) => {
      if (expense?.category && expense?.amount) {
        acc[expense.category] =
          (acc[expense.category] || 0) + parseFloat(expense.amount);
      }
      return acc;
    }, {});

  return {
    weeklyBudgets,
    setWeeklyBudgets,
    currentWeek,
    setCurrentWeek,
    expenses,
    setExpenses,
    newExpense,
    setNewExpense,
    newBudget,
    setNewBudget,
    showExpenseForm,
    setShowExpenseForm,
    showBudgetForm,
    setShowBudgetForm,
    updateWeeklyBudget,
    addCategory,
    deleteCategory,
    addExpense,
    currentWeeklyBudget,
    currentCategoryLimits,
    weeklyExpensesTotal,
    remainingWeeklyBudget,
    categorySpending,
  };
}