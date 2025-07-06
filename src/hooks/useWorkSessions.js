import { useState, useEffect } from "react";

export function useWorkSessions() {
  const [workSessions, setWorkSessions] = useState([]);
  const [showWorkSessionForm, setShowWorkSessionForm] = useState(false);
  const [newWorkSession, setNewWorkSession] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    duration: 60,
  });

  useEffect(() => {
    const saved = localStorage.getItem("aiAssistant_workSessions");
    if (saved) setWorkSessions(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("aiAssistant_workSessions", JSON.stringify(workSessions));
  }, [workSessions]);

  const addWorkSession = () => {
    if (
      !newWorkSession.title?.trim() ||
      !newWorkSession.date ||
      !newWorkSession.time
    ) {
      return;
    }
    const session = {
      id: Date.now(),
      title: newWorkSession.title.trim(),
      date: newWorkSession.date,
      time: newWorkSession.time,
      duration: parseInt(newWorkSession.duration) || 60,
      status: "scheduled",
    };
    setWorkSessions((prev) => [...prev, session]);
    setNewWorkSession({
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      duration: 60,
    });
    setShowWorkSessionForm(false);
  };

  return {
    workSessions,
    setWorkSessions,
    showWorkSessionForm,
    setShowWorkSessionForm,
    newWorkSession,
    setNewWorkSession,
    addWorkSession,
  };
}