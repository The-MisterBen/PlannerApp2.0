import { useState, useEffect } from "react";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "Ideas",
    priority: "Medium",
  });

  useEffect(() => {
    const saved = localStorage.getItem("aiAssistant_notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("aiAssistant_notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.title?.trim() || !newNote.content?.trim()) return;
    const note = {
      id: Date.now(),
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      category: newNote.category || "Ideas",
      priority: newNote.priority || "Medium",
      created: new Date().toLocaleDateString(),
    };
    setNotes((prev) => [note, ...prev]);
    setNewNote({
      title: "",
      content: "",
      category: "Ideas",
      priority: "Medium",
    });
    setShowNoteForm(false);
  };

  return {
    notes,
    setNotes,
    showNoteForm,
    setShowNoteForm,
    newNote,
    setNewNote,
    addNote,
  };
}