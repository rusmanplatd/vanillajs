import { ReactiveComponent } from '../reactive-component.js';
import { TodoService } from './todo.service.js';

/**
 * Todo Component
 * Demonstrates reactive template engine features
 */
export class TodoComponent extends ReactiveComponent {
  constructor() {
    super({
      selector: '#todo-app',
      template: `
        <div class="todo-container">
          <div class="todo-header">
            <h1>{{ title }}</h1>
            <p class="subtitle">{{ subtitle }}</p>
          </div>

          <div class="todo-input-section">
            <input
              type="text"
              class="input"
              placeholder="What needs to be done?"
              [(ngModel)]="newTodo"
              (keyup)="handleKeyUp($event)"
            />
            <button class="btn btn-primary" (click)="addTodo()">
              Add Todo
            </button>
          </div>

          <div class="todo-filters">
            <button
              class="filter-btn"
              [class.active]="filter === 'all'"
              (click)="setFilter('all')"
            >
              All ({{ totalCount }})
            </button>
            <button
              class="filter-btn"
              [class.active]="filter === 'active'"
              (click)="setFilter('active')"
            >
              Active ({{ activeCount }})
            </button>
            <button
              class="filter-btn"
              [class.active]="filter === 'completed'"
              (click)="setFilter('completed')"
            >
              Completed ({{ completedCount }})
            </button>
          </div>

          <div class="todo-list" *ngIf="filteredTodos.length > 0">
            <div *ngFor="let todo of filteredTodos; let i = index" class="todo-item">
              <div class="todo-content">
                <input
                  type="checkbox"
                  class="todo-checkbox"
                  [bind]="todo.completed"
                  (click)="toggleTodo(todo.id)"
                />
                <span
                  class="todo-title"
                  [class.completed]="todo.completed"
                >
                  {{ todo.title }}
                </span>
              </div>
              <button
                class="btn btn-sm btn-error"
                (click)="deleteTodo(todo.id)"
              >
                Delete
              </button>
            </div>
          </div>

          <div *ngIf="filteredTodos.length === 0" class="empty-state">
            <p>{{ emptyMessage }}</p>
          </div>

          <div class="todo-footer" *ngIf="totalCount > 0">
            <span>{{ activeCount }} item{{ activeCount === 1 ? '' : 's' }} left</span>
            <button
              class="btn btn-sm btn-outlined"
              (click)="clearCompleted()"
              *ngIf="completedCount > 0"
            >
              Clear Completed
            </button>
          </div>
        </div>
      `,
      data: {
        title: 'Reactive Todo App',
        subtitle: 'Built with vanilla JavaScript reactive components',
        newTodo: '',
        filter: 'all',
        todos: [],
      },
      services: {
        todoService: TodoService,
      },
      computed: {
        filteredTodos: (state) => {
          switch (state.filter) {
            case 'active':
              return state.todos.filter((t) => !t.completed);
            case 'completed':
              return state.todos.filter((t) => t.completed);
            default:
              return state.todos;
          }
        },
        totalCount: (state) => state.todos.length,
        activeCount: (state) => state.todos.filter((t) => !t.completed).length,
        completedCount: (state) =>
          state.todos.filter((t) => t.completed).length,
        emptyMessage: (state) => {
          switch (state.filter) {
            case 'active':
              return 'No active todos';
            case 'completed':
              return 'No completed todos';
            default:
              return 'No todos yet. Add one above!';
          }
        },
      },
      methods: {
        addTodo() {
          if (this.state.newTodo.trim()) {
            this.todoService.addTodo(this.state.newTodo.trim());
            this.setState({ newTodo: '' });
          }
        },
        toggleTodo(id) {
          this.todoService.toggleTodo(id);
        },
        deleteTodo(id) {
          this.todoService.deleteTodo(id);
        },
        setFilter(filter) {
          this.setState({ filter });
        },
        clearCompleted() {
          this.todoService.clearCompleted();
        },
        handleKeyUp(event) {
          if (event.key === 'Enter') {
            this.addTodo();
          }
        },
      },
    });
  }

  /**
   * OnInit lifecycle hook
   */
  onInit() {
    console.log('TodoComponent initialized');

    // Subscribe to todo service
    this._subscriptions.push(
      this.todoService.todos$.subscribe((todos) => {
        this.setState({ todos });
      })
    );
  }

  /**
   * OnMount lifecycle hook
   */
  onMount() {
    console.log('TodoComponent mounted');
  }

  /**
   * OnDestroy lifecycle hook
   */
  onDestroy() {
    console.log('TodoComponent destroyed');
  }
}
