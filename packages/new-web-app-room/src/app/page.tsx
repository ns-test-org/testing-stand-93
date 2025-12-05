'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputText.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([newTodo, ...todos]);
      setInputText('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo App</h1>
          <p className="text-gray-600">Stay organized and get things done</p>
        </div>

        {/* Add Todo Input */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            />
            <button
              onClick={addTodo}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{activeTodosCount} active tasks</span>
            <span>{completedTodosCount} completed tasks</span>
            <span>{todos.length} total tasks</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          {(['all', 'active', 'completed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterType
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredTodos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {filter === 'all' && todos.length === 0 && "No todos yet. Add one above!"}
              {filter === 'active' && activeTodosCount === 0 && "No active todos. Great job!"}
              {filter === 'completed' && completedTodosCount === 0 && "No completed todos yet."}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    todo.completed ? 'opacity-75' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {todo.createdAt.toLocaleDateString()} at {todo.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear Completed Button */}
        {completedTodosCount > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={clearCompleted}
              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Clear {completedTodosCount} completed task{completedTodosCount !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

