import { useState, useEffect } from "react";

export function useProjects() {
  const [projects, setProjects] = useState({});
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    status: "Planning",
    budget_allocated: "",
    time_allocated_hours: "",
    start_date: new Date().toISOString().split("T")[0],
    due_date: "",
    priority: "Medium",
    tasks: [""],
  });
  const [editingTask, setEditingTask] = useState({
    projectName: null,
    taskIndex: null,
    text: "",
  });
  const [editingProject, setEditingProject] = useState({
    projectName: null,
    field: null,
    value: "",
  });
  const [loggingWork, setLoggingWork] = useState({
    projectName: null,
    money: "",
    time: "",
  });

  useEffect(() => {
    const savedProjects = localStorage.getItem("aiAssistant_projects");
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);
  useEffect(() => {
    localStorage.setItem("aiAssistant_projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    if (!newProject.name?.trim()) return;
    const project = {
      status: newProject.status || "Planning",
      budget_allocated: parseFloat(newProject.budget_allocated) || 0,
      time_allocated_hours: parseFloat(newProject.time_allocated_hours) || 0,
      tasks: (newProject.tasks || [])
        .filter((task) => task?.trim())
        .map((task) => ({ step: task, done: false })),
      start_date: newProject.start_date || new Date().toISOString().split("T")[0],
      due_date: newProject.due_date || "",
      time_logged: 0,
      money_spent: 0,
      notes: [],
      priority: newProject.priority || "Medium",
    };
    setProjects((prev) => ({ ...prev, [newProject.name]: project }));
    setNewProject({
      name: "",
      status: "Planning",
      budget_allocated: "",
      time_allocated_hours: "",
      start_date: new Date().toISOString().split("T")[0],
      due_date: "",
      priority: "Medium",
      tasks: [""],
    });
    setShowProjectForm(false);
  };

  const addTaskToNewProject = () => {
    setNewProject((prev) => ({
      ...prev,
      tasks: [...(prev.tasks || []), ""],
    }));
  };

  const removeTaskFromNewProject = (index) => {
    if (index >= 0 && newProject.tasks && index < newProject.tasks.length) {
      const updatedTasks = newProject.tasks.filter((_, i) => i !== index);
      setNewProject((prev) => ({ ...prev, tasks: updatedTasks }));
    }
  };

  const updateTaskInNewProject = (index, value) => {
    if (index >= 0 && newProject.tasks && index < newProject.tasks.length) {
      const updatedTasks = [...newProject.tasks];
      updatedTasks[index] = value || "";
      setNewProject((prev) => ({ ...prev, tasks: updatedTasks }));
    }
  };

  const addTaskToProject = (projectName, taskText) => {
    if (!taskText?.trim() || !projects[projectName]) return;
    setProjects((prev) => ({
      ...prev,
      [projectName]: {
        ...prev[projectName],
        tasks: [
          ...(prev[projectName].tasks || []),
          { step: taskText.trim(), done: false },
        ],
      },
    }));
  };

  const updateProjectTaskText = (projectName, taskIndex, newText) => {
    if (!newText?.trim() || !projects[projectName]?.tasks?.[taskIndex]) return;
    setProjects((prev) => ({
      ...prev,
      [projectName]: {
        ...prev[projectName],
        tasks: prev[projectName].tasks.map((task, index) =>
          index === taskIndex ? { ...task, step: newText.trim() } : task
        ),
      },
    }));
  };

  const deleteProjectTask = (projectName, taskIndex) => {
    if (!projects[projectName]?.tasks?.[taskIndex]) return;
    setProjects((prev) => ({
      ...prev,
      [projectName]: {
        ...prev[projectName],
        tasks: prev[projectName].tasks.filter(
          (_, index) => index !== taskIndex
        ),
      },
    }));
  };

  const updateProjectBudget = (projectName, newBudget) => {
    if (!projects[projectName] || newBudget < 0) return;
    setProjects((prev) => ({
      ...prev,
      [projectName]: {
        ...prev[projectName],
        budget_allocated: parseFloat(newBudget) || 0,
      },
    }));
  };

  const updateProjectTime = (projectName, newTime) => {
    if (!projects[projectName] || newTime < 0) return;
    setProjects((prev) => ({
      ...prev,
      [projectName]: {
        ...prev[projectName],
        time_allocated_hours: parseFloat(newTime) || 0,
      },
    }));
  };

  const logProjectMoney = (projectName, amount) => {
    if (!projects[projectName] || amount <= 0) return;
    setProjects((prev) => ({
      ...prev,
      [projectName]: {
        ...prev[projectName],
        money_spent:
          (prev[projectName].money_spent || 0) + parseFloat(amount),
      },
    }));
  };

  const logProjectTime = (projectName, hours) => {
    if (!projects[projectName] || hours <= 0) return;
    setProjects((prev) => ({
      ...prev,
      [projectName]: {
        ...prev[projectName],
        time_logged: (prev[projectName].time_logged || 0) + parseFloat(hours),
      },
    }));
  };

  const updateProjectTask = (projectName, taskIndex, done) => {
    if (projects[projectName]?.tasks?.[taskIndex]) {
      setProjects((prev) => ({
        ...prev,
        [projectName]: {
          ...prev[projectName],
          tasks: prev[projectName].tasks.map((task, index) =>
            index === taskIndex ? { ...task, done: Boolean(done) } : task
          ),
        },
      }));
    }
  };

  const getProjectCompletion = (project) => {
    if (
      !project?.tasks ||
      !Array.isArray(project.tasks) ||
      project.tasks.length === 0
    ) {
      return 0;
    }
    const completedTasks = project.tasks.filter(
      (task) => task?.done === true
    ).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  return {
    projects,
    setProjects,
    showProjectForm,
    setShowProjectForm,
    newProject,
    setNewProject,
    editingTask,
    setEditingTask,
    editingProject,
    setEditingProject,
    loggingWork,
    setLoggingWork,
    addProject,
    addTaskToNewProject,
    removeTaskFromNewProject,
    updateTaskInNewProject,
    addTaskToProject,
    updateProjectTaskText,
    deleteProjectTask,
    updateProjectBudget,
    updateProjectTime,
    logProjectMoney,
    logProjectTime,
    updateProjectTask,
    getProjectCompletion,
  };
}