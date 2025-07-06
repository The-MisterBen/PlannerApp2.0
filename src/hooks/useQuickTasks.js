import { useState, useEffect } from "react";

export function useQuickTasks() {
  const [quickTasks, setQuickTasks] = useState([]);
  const [newQuickTask, setNewQuickTask] = useState({
    title: "",
    urgency: "Urgent",
    importance: "Important",
  });
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aiAssistant_quickTasks");
    if (saved) setQuickTasks(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("aiAssistant_quickTasks", JSON.stringify(quickTasks));
  }, [quickTasks]);

  const addQuickTask = () => {
    if (!newQuickTask.title?.trim()) return;
    let priority = "Don't Do";
    if (
      newQuickTask.urgency === "Urgent" &&
      newQuickTask.importance === "Important"
    ) {
      priority = "Do First";
    } else if (
      newQuickTask.urgency === "Not Urgent" &&
      newQuickTask.importance === "Important"
    ) {
      priority = "Schedule";
    } else if (
      newQuickTask.urgency === "Urgent" &&
      newQuickTask.importance === "Not Important"
    ) {
      priority = "Delegate";
    }
    const task = {
      id: Date.now(),
      title: newQuickTask.title.trim(),
      urgency: newQuickTask.urgency || "Not Urgent",
      importance: newQuickTask.importance || "Not Important",
      priority,
      completed: false,
      created: new Date().toLocaleDateString(),
    };
    setQuickTasks((prev) => [...prev, task]);
    setNewQuickTask({
      title: "",
      urgency: "Urgent",
      importance: "Important",
    });
    setShowTaskForm(false);
  };

  const toggleQuickTask = (id) => {
    setQuickTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteQuickTask = (id) => {
    setQuickTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return {
    quickTasks,
    setQuickTasks,
    newQuickTask,
    setNewQuickTask,
    showTaskForm,
    setShowTaskForm,
    addQuickTask,
    toggleQuickTask,
    deleteQuickTask,
  };
}