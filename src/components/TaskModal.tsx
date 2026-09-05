import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, Tag, Sparkles } from 'lucide-react';
import { TaskItem, TaskCategory, TaskPriority, Subtask } from '../types';
import { generateId } from '../utils/helpers';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<TaskItem>) => void;
  editingTask?: TaskItem | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Deep Work');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [feasibilityTag, setFeasibilityTag] = useState('Realistic');
  const [uniquenessTag, setUniquenessTag] = useState('High Impact');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setEstimatedMinutes(editingTask.estimatedMinutes);
      setFeasibilityTag(editingTask.feasibilityTag || 'Realistic');
      setUniquenessTag(editingTask.uniquenessTag || 'High Impact');
      setSubtasks(editingTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Deep Work');
      setPriority('medium');
      setEstimatedMinutes(45);
      setFeasibilityTag('Realistic');
      setUniquenessTag('High Impact');
      setSubtasks([]);
    }
  }, [editingTask, isOpen]);

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: generateId(), text: newSubtaskText.trim(), completed: false },
    ]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: editingTask ? editingTask.id : generateId(),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      feasibilityTag,
      uniquenessTag,
      subtasks,
      status: editingTask ? editingTask.status : 'todo',
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      source: editingTask ? editingTask.source : 'manual',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-slate-900 font-display mb-4">
          {editingTask ? 'Edit Daily Goal / Task' : 'Add New Daily Goal'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Goal or Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement schema migration script"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Concrete deliverables and mental checkpoints..."
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Category, Priority, Estimated Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Deep Work">Deep Work</option>
                <option value="Learning">Learning</option>
                <option value="Admin">Admin</option>
                <option value="Review">Review</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Est. Minutes
              </label>
              <input
                type="number"
                min="5"
                max="480"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Feasibility Tag
              </label>
              <select
                value={feasibilityTag}
                onChange={(e) => setFeasibilityTag(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Realistic">Realistic</option>
                <option value="Quick Win">Quick Win</option>
                <option value="Stretch">Stretch Sprint</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Uniqueness / Impact
              </label>
              <select
                value={uniquenessTag}
                onChange={(e) => setUniquenessTag(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="High Impact">High Impact</option>
                <option value="Core Foundation">Core Foundation</option>
                <option value="Polish">Polish & Review</option>
              </select>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtasks / Execution Steps
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                placeholder="Add bite-sized step..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 max-h-32 overflow-y-auto">
              {subtasks.map((s) => (
                <div key={s.id} className="flex items-center justify-between bg-slate-50 px-2.5 py-1 rounded text-xs">
                  <span className="text-slate-700 text-[11px] truncate">{s.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(s.id)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              {editingTask ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
