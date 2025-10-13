import React, { useState, useEffect } from 'react';
import './NotesManager.css';

/**
 * NotesManager - Main frontend component for note management
 */
const NotesManager = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    completed: '',
    tags: []
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [stats, setStats] = useState(null);

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
    loadStats();
  }, []);

  // Load notes with current filters
  useEffect(() => {
    loadNotes();
  }, [searchQuery, filters]);

  /**
   * Load notes from API
   */
  const loadNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchQuery) params.append('search', searchQuery);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.completed) params.append('completed', filters.completed);
      if (filters.tags.length > 0) params.append('tags', filters.tags.join(','));

      const response = await fetch(`/api/notes?${params}`);
      const data = await response.json();

      if (data.success) {
        setNotes(data.notes);
      } else {
        setError(data.error || 'Failed to load notes');
      }
    } catch (err) {
      setError('Network error while loading notes');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load notes statistics
   */
  const loadStats = async () => {
    try {
      const response = await fetch('/api/notes/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  /**
   * Create new note
   */
  const createNote = async (noteData) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      const data = await response.json();

      if (data.success) {
        setNotes([data.note, ...notes]);
        setShowCreateForm(false);
        loadStats();
        return data.note;
      } else {
        throw new Error(data.error || 'Failed to create note');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Update existing note
   */
  const updateNote = async (noteId, updateData) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        setNotes(notes.map(note =>
          note.id === noteId ? { ...note, ...updateData } : note
        ));
        loadStats();
        return data.note;
      } else {
        throw new Error(data.error || 'Failed to update note');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Delete note
   */
  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setNotes(notes.filter(note => note.id !== noteId));
        setSelectedNote(null);
        loadStats();
      } else {
        throw new Error(data.error || 'Failed to delete note');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Toggle note completion
   */
  const toggleNoteCompletion = async (noteId, completed) => {
    await updateNote(noteId, { completed: !completed });
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get priority label and color
   */
  const getPriorityInfo = (priority) => {
    const priorities = {
      1: { label: 'Low', color: '#10b981', bg: '#ecfdf5' },
      2: { label: 'Medium', color: '#f59e0b', bg: '#fffbeb' },
      3: { label: 'High', color: '#ef4444', bg: '#fef2f2' },
      4: { label: 'Urgent', color: '#dc2626', bg: '#fef2f2' }
    };
    return priorities[priority] || priorities[2];
  };

  return (
    <div className="notes-manager">
      {/* Header */}
      <div className="notes-header">
        <div className="header-title">
          <h1>📝 Notes & Reminders</h1>
          {stats && (
            <div className="stats-summary">
              <span className="stat">{stats.total} total</span>
              <span className="stat">{stats.pending} pending</span>
              <span className="stat">{stats.completed} completed</span>
            </div>
          )}
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          ✏️ New Note
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="task">Task</option>
            <option value="reminder">Reminder</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="idea">Idea</option>
            <option value="learning">Learning</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Urgent</option>
          </select>

          <select
            value={filters.completed}
            onChange={(e) => setFilters({...filters, completed: e.target.value})}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Main Content */}
      <div className="notes-content">
        {/* Notes List */}
        <div className="notes-list">
          {loading ? (
            <div className="loading">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes found</p>
              <button
                className="btn-secondary"
                onClick={() => setShowCreateForm(true)}
              >
                Create your first note
              </button>
            </div>
          ) : (
            notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onSelect={setSelectedNote}
                onToggleComplete={toggleNoteCompletion}
                onDelete={deleteNote}
                isSelected={selectedNote?.id === note.id}
                formatDate={formatDate}
                getPriorityInfo={getPriorityInfo}
              />
            ))
          )}
        </div>

        {/* Note Detail/Create Form */}
        <div className="note-detail">
          {showCreateForm ? (
            <NoteForm
              onSubmit={createNote}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : selectedNote ? (
            <NoteDetail
              note={selectedNote}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onClose={() => setSelectedNote(null)}
              formatDate={formatDate}
              getPriorityInfo={getPriorityInfo}
            />
          ) : (
            <div className="no-selection">
              <p>Select a note to view details or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * NoteCard - Individual note display component
 */
const NoteCard = ({
  note,
  onSelect,
  onToggleComplete,
  onDelete,
  isSelected,
  formatDate,
  getPriorityInfo
}) => {
  const priorityInfo = getPriorityInfo(note.priority);

  return (
    <div
      className={`note-card ${isSelected ? 'selected' : ''} ${note.completed ? 'completed' : ''}`}
      onClick={() => onSelect(note)}
    >
      <div className="note-header">
        <div className="note-title">{note.title}</div>
        <div className="note-actions">
          <button
            className={`btn-complete ${note.completed ? 'completed' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(note.id, note.completed);
            }}
            title={note.completed ? 'Mark as pending' : 'Mark as completed'}
          >
            {note.completed ? '✅' : '⭕'}
          </button>
        </div>
      </div>

      <div className="note-content-preview">
        {note.content.substring(0, 100)}
        {note.content.length > 100 && '...'}
      </div>

      <div className="note-meta">
        <span className="note-category">{note.category}</span>
        <span
          className="note-priority"
          style={{
            color: priorityInfo.color,
            backgroundColor: priorityInfo.bg
          }}
        >
          {priorityInfo.label}
        </span>
        {note.hasReminder && <span className="reminder-indicator">⏰</span>}
      </div>

      <div className="note-footer">
        <span className="note-date">{formatDate(note.createdAt)}</span>
        {note.tags && note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * NoteForm - Create/Edit note form
 */
const NoteForm = ({ note = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    category: note?.category || 'general',
    priority: note?.priority || 2,
    tags: note?.tags?.join(', ') || '',
    reminder: note?.reminder?.datetime || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noteData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      reminder: formData.reminder ? {
        datetime: formData.reminder,
        type: 'once'
      } : null
    };

    try {
      await onSubmit(noteData);
    } catch (err) {
      // Error handling is done in parent component
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{note ? 'Edit Note' : 'Create New Note'}</h3>
        <button type="button" onClick={onCancel} className="btn-close">✕</button>
      </div>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter note title (optional)"
        />
      </div>

      <div className="form-group">
        <label>Content *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          placeholder="Enter note content..."
          required
          rows={6}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="general">General</option>
            <option value="task">Task</option>
            <option value="reminder">Reminder</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="idea">Idea</option>
            <option value="learning">Learning</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
          >
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
            <option value={4}>Urgent</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Tags</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          placeholder="Enter tags separated by commas"
        />
      </div>

      <div className="form-group">
        <label>Reminder</label>
        <input
          type="datetime-local"
          value={formData.reminder}
          onChange={(e) => setFormData({...formData, reminder: e.target.value})}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {note ? 'Update' : 'Create'} Note
        </button>
      </div>
    </form>
  );
};

/**
 * NoteDetail - Detailed note view
 */
const NoteDetail = ({
  note,
  onUpdate,
  onDelete,
  onClose,
  formatDate,
  getPriorityInfo
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const priorityInfo = getPriorityInfo(note.priority);

  if (isEditing) {
    return (
      <NoteForm
        note={note}
        onSubmit={async (noteData) => {
          await onUpdate(note.id, noteData);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="note-detail-view">
      <div className="detail-header">
        <div className="detail-title">
          <h3>{note.title}</h3>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="detail-actions">
          <button onClick={() => setIsEditing(true)} className="btn-secondary">
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="btn-danger"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="detail-meta">
        <span className="meta-item">
          <strong>Category:</strong> {note.category}
        </span>
        <span
          className="meta-item priority"
          style={{
            color: priorityInfo.color,
            backgroundColor: priorityInfo.bg
          }}
        >
          <strong>Priority:</strong> {priorityInfo.label}
        </span>
        <span className="meta-item">
          <strong>Status:</strong> {note.completed ? 'Completed' : 'Pending'}
        </span>
      </div>

      <div className="detail-content">
        <h4>Content</h4>
        <div className="content-text">{note.content}</div>
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="detail-tags">
          <h4>Tags</h4>
          <div className="tags-list">
            {note.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
      )}

      {note.reminder && (
        <div className="detail-reminder">
          <h4>⏰ Reminder</h4>
          <p>{formatDate(note.reminder.datetime)}</p>
        </div>
      )}

      <div className="detail-timestamps">
        <p><strong>Created:</strong> {formatDate(note.metadata?.createdAt || note.createdAt)}</p>
        {note.metadata?.updatedAt && note.metadata.updatedAt !== note.metadata.createdAt && (
          <p><strong>Updated:</strong> {formatDate(note.metadata.updatedAt)}</p>
        )}
      </div>
    </div>
  );
};

export default NotesManager;