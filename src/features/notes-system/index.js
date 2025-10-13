/**
 * Notes System Frontend - Main Entry Point
 */

import NotesManager from './NotesManager.jsx';
import './NotesManager.css';

// Export the main component
export default NotesManager;

// Export additional utilities if needed
export { NotesManager };

// Component metadata
export const NotesSystemInfo = {
  name: 'Notes & Reminders System',
  version: '1.0.0',
  description: 'AI-powered note taking and reminder management interface',
  features: [
    'Create, edit, and organize notes',
    'Set time-based reminders',
    'Search and filter notes',
    'Category and priority management',
    'Tag-based organization',
    'Real-time updates'
  ]
};