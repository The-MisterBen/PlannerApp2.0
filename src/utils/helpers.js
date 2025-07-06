export function safeAccess(obj, path, defaultValue = null) {
  try {
    return (
      path
        .split(".")
        .reduce((current, key) => current && current[key], obj) ||
      defaultValue
    );
  } catch (error) {
    console.warn("Safe access failed:", error);
    return defaultValue;
  }
}

export function getBudgetForWeek(weeklyBudgets, week) {
  return (
    weeklyBudgets[week] || {
      budget: 500,
      categoryLimits: {
        Food: 100,
        Transport: 80,
        Entertainment: 50,
        Shopping: 70,
        Other: 50,
      },
    }
  );
}

export function getMonthName(offset) {
  const currentDate = new Date();
  const targetDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + offset,
    1
  );
  return targetDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getPriorityInfo(priority) {
  const priorityMap = {
    "Do First": {
      color: "bg-blue-500/20 text-blue-300 border-blue-400/30",
      icon: "🔥",
      description: "Urgent & Important",
    },
    Schedule: {
      color: "bg-green-500/20 text-green-300 border-green-400/30",
      icon: "📅",
      description: "Important, Not Urgent",
    },
    Delegate: {
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
      icon: "👥",
      description: "Urgent, Not Important",
    },
    "Don't Do": {
      color: "bg-red-500/20 text-red-300 border-red-400/30",
      icon: "🚫",
      description: "Not Urgent, Not Important",
    },
  };

  return (
    priorityMap[priority] || {
      color: "bg-gray-500/20 text-gray-300 border-gray-400/30",
      icon: "📝",
      description: "Unassigned",
    }
  );
}