"use client";

import React, { useState, useEffect } from "react";
import { backendUrl } from "@/lib/config";
/**
 * NotesPanel - Next.js component for note management with Tailwind CSS
 * Integrates with the existing AI chat interface
 */

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: number;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  completed: boolean;
  hasReminder: boolean;
}

interface Reminder {
  id: string;
  title: string;
  content: string;
  reminderTime: string;
  timeExpression?: string;
  type: string;
  status: string;
  completed: boolean;
  priority?: string;
  createdAt: string;
  updatedAt?: string;
}

interface NotesAction {
  type: string;
  action: string;
  message: string;
  note?: Note;
}

interface NotesPanelProps {
  notesAction?: NotesAction | null;
  relevantNotes?: Note[];
  className?: string;
  isModal?: boolean; // Add flag to indicate if this is opened in modal
}

export default function NotesPanel({
  notesAction,
  relevantNotes = [],
  className = "",
  isModal = false,
}: NotesPanelProps) {
  const [isExpanded, setIsExpanded] = useState(isModal); // Auto-expand if in modal
  const [activeTab, setActiveTab] = useState<"notes" | "reminders">("notes"); // Tab state

  // Notes state
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");

  // Reminders state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(false);

  // Load notes immediately when modal opens
  useEffect(() => {
    if (isModal) {
      loadRecentNotes();
      loadReminders();
    }
  }, [isModal]);

  useEffect(() => {
    if (
      notesAction &&
      (notesAction.type === "note_command" ||
        notesAction.type === "notes_action")
    ) {
      setIsExpanded(true);
      loadRecentNotes();
    }
  }, [notesAction]);

  useEffect(() => {
    if (relevantNotes.length > 0) {
      setIsExpanded(true);
    }
  }, [relevantNotes]);

  /**
   * Load recent notes from API
   */
  const loadRecentNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/notes?limit=50`);
      const data = await response.json();

      if (data.success) {
        setRecentNotes(data.notes || []);
        console.log(`📝 Loaded ${data.notes?.length || 0} notes from database`);
      } else {
        console.error("Failed to load notes:", data.error);
        setRecentNotes([]);
      }
    } catch (error) {
      console.error("Error loading recent notes:", error);
      setRecentNotes([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new note
   */
  const createNote = async (title: string, content: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || "Untitled Note",
          content,
          category: "general",
          priority: 2,
          tags: ["manual-created"],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewNoteTitle("");
        setNewNoteContent("");
        setShowCreateForm(false);
        loadRecentNotes();
        console.log("✅ Note created successfully");
        return data.note;
      } else {
        throw new Error(data.error || "Failed to create note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Failed to create note: " + (error as Error).message);
      throw error;
    }
  };

  /**
   * Delete a note
   */
  const deleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/notes/${noteId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        loadRecentNotes();
        console.log("🗑️ Note deleted successfully");
      } else {
        throw new Error(data.error || "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note: " + (error as Error).message);
    }
  };

  /**
   * Toggle note completion
   */
  const toggleNoteCompletion = async (noteId: string, completed: boolean) => {
    try {
      const response = await fetch(`${backendUrl}/api/notes/${noteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });

      const data = await response.json();

      if (data.success) {
        loadRecentNotes();
        console.log("✅ Note completion toggled");
      }
    } catch (error) {
      console.error("Error toggling note completion:", error);
    }
  };

  /**
   * Load reminders from API
   */
  const loadReminders = async () => {
    try {
      setRemindersLoading(true);
      const response = await fetch(
        `${backendUrl}/api/notes/reminders?limit=100`
      );
      const data = await response.json();

      if (data.success) {
        setReminders(data.reminders || []);
        console.log(
          `⏰ Loaded ${data.reminders?.length || 0} reminders from database`
        );
      } else {
        console.error("Failed to load reminders:", data.error);
        setReminders([]);
      }
    } catch (error) {
      console.error("Error loading reminders:", error);
      setReminders([]);
    } finally {
      setRemindersLoading(false);
    }
  };

  /**
   * Toggle reminder completion
   */
  const toggleReminderCompletion = async (
    reminderId: string,
    completed: boolean
  ) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/notes/reminders/${reminderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: !completed }),
        }
      );

      const data = await response.json();

      if (data.success) {
        loadReminders();
        console.log("✅ Reminder completion toggled");
      }
    } catch (error) {
      console.error("Error toggling reminder completion:", error);
    }
  };

  /**
   * Delete reminder
   */
  const deleteReminder = async (reminderId: string) => {
    if (!confirm("Are you sure you want to delete this reminder?")) {
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/notes/reminders/${reminderId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        loadReminders();
        console.log("🗑️ Reminder deleted successfully");
      } else {
        throw new Error(data.error || "Failed to delete reminder");
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
      alert("Failed to delete reminder: " + (error as Error).message);
    }
  };

  /**
   * Get priority info
   */
  const getPriorityInfo = (priority: number) => {
    const priorities = {
      1: { label: "Low", color: "text-green-600", bg: "bg-green-50" },
      2: { label: "Medium", color: "text-yellow-600", bg: "bg-yellow-50" },
      3: { label: "High", color: "text-orange-600", bg: "bg-orange-50" },
      4: { label: "Urgent", color: "text-red-600", bg: "bg-red-50" },
    };
    return priorities[priority as keyof typeof priorities] || priorities[2];
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Don't render if no notes activity and panel is collapsed (unless it's in modal mode)
  if (!isModal && !isExpanded && !notesAction && relevantNotes.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
    >
      {/* Panel Header - hide toggle in modal mode */}
      {!isModal && (
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">📝</span>
            <h3 className="font-semibold text-gray-900">Notes & Reminders</h3>
            {(notesAction || relevantNotes.length > 0) && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {notesAction ? "Action" : `${relevantNotes.length} relevant`}
              </span>
            )}
          </div>

          <span className="text-gray-400 text-lg">
            {isExpanded ? "▲" : "▼"}
          </span>
        </div>
      )}

      {/* Panel Content */}
      {(isExpanded || isModal) && (
        <div className={!isModal ? "border-t border-gray-200" : ""}>
          {/* Tabs - only show in modal mode */}
          {isModal && (
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "notes"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                📝 Notes ({recentNotes.length})
              </button>
              <button
                onClick={() => setActiveTab("reminders")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "reminders"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                ⏰ Reminders ({reminders.length})
              </button>
            </div>
          )}

          {/* Notes Action Display */}
          {notesAction && notesAction.type === "note_command" && (
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  {notesAction.action === "created" && "✅"}
                  {notesAction.action === "search_results" && "🔍"}
                  {notesAction.action === "list" && "📋"}
                  {notesAction.action === "reminder_set" && "⏰"}
                  {notesAction.action === "completed" && "✅"}
                  {notesAction.action === "deleted" && "🗑️"}
                  {notesAction.action === "stats" && "📊"}
                  {notesAction.action === "error" && "❌"}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {notesAction.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Auto-extracted Notes Action */}
          {notesAction && notesAction.type === "notes_action" && (
            <div className="p-4 bg-green-50 border-b border-gray-200">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  {notesAction.action === "note_created" && "📝"}
                  {notesAction.action === "reminder_set" && "⏰"}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-800">
                    {notesAction.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Relevant Notes */}
          {relevantNotes.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Relevant Notes
              </h4>
              <div className="space-y-2">
                {relevantNotes.slice(0, 3).map((note) => {
                  const priorityInfo = getPriorityInfo(note.priority);
                  return (
                    <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="text-sm font-medium text-gray-900">
                              {note.title}
                            </h5>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${priorityInfo.bg} ${priorityInfo.color}`}
                            >
                              {priorityInfo.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {note.content}
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-xs text-gray-500">
                              {note.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(note.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NOTES TAB CONTENT */}
          {(!isModal || activeTab === "notes") && (
            <>
              {/* Quick Actions */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Quick Actions
                  </h4>
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {showCreateForm ? "Cancel" : "New Note"}
                  </button>
                </div>

                {/* Create Note Form */}
                {showCreateForm && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="Note title (optional)..."
                      className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Enter note content..."
                      className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => createNote(newNoteTitle, newNoteContent)}
                        disabled={!newNoteContent.trim()}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                      >
                        Create Note
                      </button>
                    </div>
                  </div>
                )}

                {/* Note Commands Help */}
                <div className="mt-3 text-xs text-gray-500">
                  <p className="font-medium mb-1">Chat Commands:</p>
                  <ul className="space-y-1">
                    <li>• "note [content]" - Create note</li>
                    <li>• "remind me [content]" - Set reminder</li>
                    <li>• "show notes" - List notes</li>
                    <li>• "search notes [query]" - Search</li>
                    <li>• "notes stats" - View statistics</li>
                  </ul>
                </div>
              </div>

              {/* Recent Notes */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Recent Notes
                  </h4>
                  <button
                    onClick={loadRecentNotes}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="text-xs text-gray-500 text-center py-4">
                    Loading notes...
                  </div>
                ) : recentNotes.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {recentNotes.map((note) => {
                      const priorityInfo = getPriorityInfo(note.priority);
                      return (
                        <div
                          key={note.id}
                          className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <button
                                  onClick={() =>
                                    toggleNoteCompletion(
                                      note.id,
                                      note.completed
                                    )
                                  }
                                  className="flex-shrink-0 text-lg hover:scale-110 transition-transform"
                                  title={
                                    note.completed
                                      ? "Mark as incomplete"
                                      : "Mark as complete"
                                  }
                                >
                                  {note.completed ? "✅" : "⭕"}
                                </button>
                                <h5
                                  className={`text-sm font-medium truncate ${
                                    note.completed
                                      ? "text-gray-500 line-through"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {note.title}
                                </h5>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${priorityInfo.bg} ${priorityInfo.color}`}
                                >
                                  {priorityInfo.label}
                                </span>
                              </div>
                              <p
                                className={`text-xs line-clamp-2 ${
                                  note.completed
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {note.content}
                              </p>
                              <div className="flex items-center space-x-3 mt-2">
                                <span className="text-xs text-gray-500">
                                  {note.category}
                                </span>
                                {note.hasReminder && (
                                  <span className="text-xs">⏰</span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {formatDate(note.createdAt)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-colors"
                              title="Delete note"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 text-center py-4">
                    No notes yet. Click "New Note" to create one!
                  </div>
                )}
              </div>
            </>
          )}

          {/* REMINDERS TAB CONTENT */}
          {isModal && activeTab === "reminders" && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">
                  All Reminders
                </h4>
                <button
                  onClick={loadReminders}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Refresh
                </button>
              </div>

              {remindersLoading ? (
                <div className="text-xs text-gray-500 text-center py-4">
                  Loading reminders...
                </div>
              ) : reminders.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {reminders.map((reminder) => {
                    const reminderDate = new Date(reminder.reminderTime);
                    const isOverdue =
                      reminderDate < new Date() &&
                      reminder.status === "scheduled";

                    return (
                      <div
                        key={reminder.id}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <button
                                onClick={() =>
                                  toggleReminderCompletion(
                                    reminder.id,
                                    reminder.completed
                                  )
                                }
                                className="flex-shrink-0 text-lg hover:scale-110 transition-transform"
                                title={
                                  reminder.completed
                                    ? "Mark as incomplete"
                                    : "Mark as complete"
                                }
                              >
                                {reminder.completed ? "✅" : "⏰"}
                              </button>
                              <h5
                                className={`text-sm font-medium truncate ${
                                  reminder.completed
                                    ? "text-gray-500 line-through"
                                    : "text-gray-900"
                                }`}
                              >
                                {reminder.title}
                              </h5>
                              {isOverdue && !reminder.completed && (
                                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                                  Overdue
                                </span>
                              )}
                              {reminder.status === "triggered" && (
                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">
                                  Fired
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs line-clamp-2 ${
                                reminder.completed
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {reminder.content}
                            </p>
                            <div className="flex items-center space-x-3 mt-2">
                              <span className="text-xs text-gray-500">
                                📅 {reminderDate.toLocaleDateString()}{" "}
                                {reminderDate.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {reminder.timeExpression && (
                                <span className="text-xs text-gray-400">
                                  ({reminder.timeExpression})
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-colors"
                            title="Delete reminder"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center py-4">
                  No reminders yet. Try saying "remind me to..." in the chat!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
