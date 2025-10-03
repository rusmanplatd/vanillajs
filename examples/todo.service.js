import { BehaviorSubject } from '../packages/rxjs/esm/index.js';
import { Service } from ../src/js/injector.js';

/**
 * Todo Service
 * Manages todo items with reactive state
 */
export class TodoService {
  constructor() {
    this.todos$ = new BehaviorSubject([]);
    this._todos = [];
    this._nextId = 1;

    // Load from localStorage
    this._loadFromStorage();
  }

  /**
   * Get all todos
   * @returns {Array} All todos
   */
  getTodos() {
    return this._todos;
  }

  /**
   * Add a new todo
   * @param {string} title - Todo title
   */
  addTodo(title) {
    const todo = {
      id: this._nextId++,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this._todos.push(todo);
    this._update();
  }

  /**
   * Toggle todo completion
   * @param {number} id - Todo ID
   */
  toggleTodo(id) {
    const todo = this._todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this._update();
    }
  }

  /**
   * Delete todo
   * @param {number} id - Todo ID
   */
  deleteTodo(id) {
    this._todos = this._todos.filter((t) => t.id !== id);
    this._update();
  }

  /**
   * Clear completed todos
   */
  clearCompleted() {
    this._todos = this._todos.filter((t) => !t.completed);
    this._update();
  }

  /**
   * Update state and persist
   */
  _update() {
    this.todos$.next([...this._todos]);
    this._saveToStorage();
  }

  /**
   * Save to localStorage
   */
  _saveToStorage() {
    try {
      localStorage.setItem('todos', JSON.stringify(this._todos));
      localStorage.setItem('nextId', this._nextId.toString());
    } catch (error) {
      console.warn('Failed to save todos:', error);
    }
  }

  /**
   * Load from localStorage
   */
  _loadFromStorage() {
    try {
      const stored = localStorage.getItem('todos');
      const nextId = localStorage.getItem('nextId');

      if (stored) {
        this._todos = JSON.parse(stored);
        this.todos$.next([...this._todos]);
      }

      if (nextId) {
        this._nextId = parseInt(nextId, 10);
      }
    } catch (error) {
      console.warn('Failed to load todos:', error);
    }
  }
}

// Apply Service decorator as a function call (browser-compatible)
Service({ providedIn: 'root' })(TodoService);
