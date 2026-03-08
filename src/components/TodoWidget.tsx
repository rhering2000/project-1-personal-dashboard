'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string | null;
}

export default function TodoWidget() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('dashboard-todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  function saveTodos(updated: Todo[]) {
    setTodos(updated);
    localStorage.setItem('dashboard-todos', JSON.stringify(updated));
  }

  function addTodo() {
    if (!input.trim()) return;
    saveTodos([...todos, {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      dueDate: dueDate || null,
    }]);
    setInput('');
    setDueDate('');
  }

  function toggleTodo(id: number) {
    saveTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function deleteTodo(id: number) {
    saveTodos(todos.filter(t => t.id !== id));
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditDueDate(todo.dueDate ?? '');
  }

  function saveEdit(id: number) {
    if (!editText.trim()) return;
    saveTodos(todos.map(t => t.id === id
      ? { ...t, text: editText.trim(), dueDate: editDueDate || null }
      : t
    ));
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') addTodo();
  }

  function handleEditKeyDown(e: React.KeyboardEvent, id: number) {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') cancelEdit();
  }

  function formatDueDate(dueDate: string) {
    const date = new Date(dueDate);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Overdue', color: 'text-red-500' };
    if (diffDays === 0) return { label: 'Due today', color: 'text-orange-500' };
    if (diffDays === 1) return { label: 'Due tomorrow', color: 'text-yellow-500' };
    return {
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: 'text-gray-400',
    };
  }

  const sorted = [...todos].sort((a, b) => {
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">To Do</h2>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={addTodo}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <ul className="space-y-2">
        {sorted.length === 0 && (
          <li className="text-sm text-gray-400 text-center py-4">No tasks yet</li>
        )}
        {sorted.map(todo => {
          const due = todo.dueDate ? formatDueDate(todo.dueDate) : null;
          const isEditing = editingId === todo.id;

          return (
            <li key={todo.id} className="flex items-start gap-3 group">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mt-1 h-4 w-4 rounded border-gray-300 accent-blue-500"
              />

              {isEditing ? (
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => handleEditKeyDown(e, todo.id)}
                    autoFocus
                    className="rounded border border-blue-300 px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="datetime-local"
                    value={editDueDate}
                    onChange={e => setEditDueDate(e.target.value)}
                    className="rounded border border-gray-200 px-2 py-1 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => saveEdit(todo.id)} className="text-xs text-blue-500 hover:text-blue-700 font-medium">Save</button>
                    <button onClick={cancelEdit} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <span className={`text-sm block ${todo.completed ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                    {todo.text}
                  </span>
                  {due && (
                    <span className={`text-xs ${todo.completed ? 'text-gray-300' : due.color}`}>
                      {due.label}
                    </span>
                  )}
                </div>
              )}

              {!isEditing && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                  <button onClick={() => startEditing(todo)} className="text-gray-300 hover:text-blue-400">✎</button>
                  <button onClick={() => deleteTodo(todo.id)} className="text-gray-300 hover:text-red-400">✕</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
