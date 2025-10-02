# Reactive Template Engine

Angular-like reactive component system built with vanilla JavaScript and RxJS.

## Features

- ✅ **Reactive State Management** - RxJS-powered reactive state with BehaviorSubject
- ✅ **Template Compilation** - HTML templates with interpolation `{{ }}`
- ✅ **Data Binding** - One-way `[property]`, two-way `[(ngModel)]`, and event `(click)`
- ✅ **Structural Directives** - `*ngIf`, `*ngFor`, `*ngSwitch`
- ✅ **Attribute Directives** - `[ngClass]`, `[ngStyle]`, `[class.name]`, `[style.prop]`
- ✅ **Lifecycle Hooks** - `onInit()`, `onMount()`, `onChange()`, `onDestroy()`
- ✅ **Dependency Injection** - Service injection with DI container
- ✅ **Computed Properties** - Derived state that auto-updates
- ✅ **Change Detection** - Automatic UI updates on state changes
- ✅ **Component Events** - Custom event emitters

## Quick Start

### 1. Create a Component

```javascript
import { ReactiveComponent } from './src/reactive-component.js';

class MyComponent extends ReactiveComponent {
  constructor() {
    super({
      selector: '#app',
      template: `
        <div>
          <h1>{{ title }}</h1>
          <p>Count: {{ count }}</p>
          <button (click)="increment()">Increment</button>
        </div>
      `,
      data: {
        title: 'Hello World',
        count: 0,
      },
      methods: {
        increment() {
          this.setState({ count: this.state.count + 1 });
        },
      },
    });
  }
}

// Mount component
const app = new MyComponent();
app.mount('#app');
```

### 2. HTML Setup

```html
<!doctype html>
<html>
  <body>
    <div id="app"></div>
    <script type="module" src="./app.js"></script>
  </body>
</html>
```

That's it! Your reactive component is ready.

## Core Concepts

### State Management

Components manage state using RxJS BehaviorSubject:

```javascript
data: {
  count: 0,
  name: 'John'
}

// Update state
this.setState({ count: this.state.count + 1 });

// Or with updater function
this.setState(state => ({ count: state.count + 1 }));

// Update single property
this.updateState('count', 5);
```

### Template Interpolation

Use `{{ expression }}` for interpolation:

```html
<h1>{{ title }}</h1>
<p>{{ user.name }}</p>
<p>{{ count * 2 }}</p>
<p>{{ count > 0 ? 'Positive' : 'Zero or Negative' }}</p>
```

### Data Binding

#### Property Binding `[property]`

```html
<input type="text" [value]="username" />
<div [textContent]="message"></div>
```

#### Event Binding `(event)`

```html
<button (click)="handleClick()">Click Me</button>
<input (input)="handleInput($event)" />
<form (submit)="handleSubmit($event)">Submit</form>
```

#### Two-Way Binding `[(ngModel)]`

```html
<input type="text" [(ngModel)]="username" />
<input type="checkbox" [(ngModel)]="isActive" />
<textarea [(ngModel)]="description"></textarea>
```

### Directives

#### \*ngIf - Conditional Rendering

```html
<div *ngIf="isVisible">I'm visible!</div>
<div *ngIf="count > 0">Count is positive</div>
<div *ngIf="user && user.name">Hello {{ user.name }}</div>
```

#### \*ngFor - List Rendering

```html
<!-- Basic -->
<div *ngFor="let item of items">{{ item }}</div>

<!-- With index -->
<div *ngFor="let item of items; let i = index">{{ i }}: {{ item }}</div>

<!-- With objects -->
<div *ngFor="let user of users">{{ user.name }} - {{ user.email }}</div>
```

#### \*ngSwitch - Multiple Conditions

```html
<div [ngSwitch]="color">
  <p *ngSwitchCase="'red'">Color is red</p>
  <p *ngSwitchCase="'blue'">Color is blue</p>
  <p *ngSwitchDefault>Unknown color</p>
</div>
```

#### [ngClass] - Dynamic Classes

```html
<!-- Object syntax -->
<div [ngClass]="{ active: isActive, disabled: isDisabled }">Content</div>

<!-- String syntax -->
<div [ngClass]="'btn btn-primary'">Button</div>

<!-- Array syntax -->
<div [ngClass]="['btn', 'btn-' + buttonType]">Button</div>
```

#### [ngStyle] - Dynamic Styles

```html
<div [ngStyle]="{ color: textColor, fontSize: fontSize + 'px' }">Styled text</div>
```

#### [class.name] - Single Class Binding

```html
<div [class.active]="isActive">Toggle active class</div>
<div [class.error]="hasError">Toggle error class</div>
```

#### [style.property] - Single Style Binding

```html
<div [style.color]="textColor">Colored text</div>
<div [style.font-size]="fontSize + 'px'">Sized text</div>
```

### Computed Properties

Derived state that automatically updates:

```javascript
computed: {
  fullName: (state) => `${state.firstName} ${state.lastName}`,
  itemCount: (state) => state.items.length,
  hasItems: (state) => state.items.length > 0,
  total: (state) => state.items.reduce((sum, item) => sum + item.price, 0)
}
```

Use in template:

```html
<p>{{ fullName }}</p>
<p>Total items: {{ itemCount }}</p>
```

### Lifecycle Hooks

```javascript
class MyComponent extends ReactiveComponent {
  onInit() {
    // Called before mounting
    console.log('Component initializing');
  }

  onMount() {
    // Called after mounted to DOM
    console.log('Component mounted');
  }

  onChange(state) {
    // Called when state changes
    console.log('State changed:', state);
  }

  onDestroy() {
    // Called before destruction
    console.log('Component destroying');
  }
}
```

### Dependency Injection

#### Create a Service

```javascript
import { Service } from './src/injector.js';
import { BehaviorSubject } from './packages/rxjs/cjs/index.js';

@Service({ providedIn: 'root' })
export class DataService {
  constructor() {
    this.data$ = new BehaviorSubject([]);
  }

  getData() {
    return this.data$.getValue();
  }

  updateData(data) {
    this.data$.next(data);
  }
}
```

#### Inject Service into Component

```javascript
import { DataService } from './data.service.js';

class MyComponent extends ReactiveComponent {
  constructor() {
    super({
      // ... other options
      services: {
        dataService: DataService,
      },
    });
  }

  onInit() {
    // Use injected service
    this._subscriptions.push(
      this.dataService.data$.subscribe((data) => {
        this.setState({ data });
      })
    );
  }
}
```

### Component Events

Emit and listen to custom events:

```javascript
methods: {
  handleClick() {
    // Emit event
    this.emit('itemClicked', { id: 123, name: 'Item' });
  }
}

// Listen to event
component.on('itemClicked', (data) => {
  console.log('Item clicked:', data);
});
```

## Complete Example

```javascript
import { ReactiveComponent } from './src/reactive-component.js';
import { DataService } from './data.service.js';

export class TodoComponent extends ReactiveComponent {
  constructor() {
    super({
      selector: '#todo-app',
      template: `
        <div class="todo-app">
          <h1>{{ title }}</h1>

          <!-- Input section -->
          <div class="input-section">
            <input
              type="text"
              [(ngModel)]="newTodo"
              (keyup)="handleKeyPress($event)"
              placeholder="What needs to be done?"
            />
            <button (click)="addTodo()">Add</button>
          </div>

          <!-- Filters -->
          <div class="filters">
            <button
              (click)="setFilter('all')"
              [class.active]="filter === 'all'"
            >
              All ({{ todos.length }})
            </button>
            <button
              (click)="setFilter('active')"
              [class.active]="filter === 'active'"
            >
              Active ({{ activeCount }})
            </button>
            <button
              (click)="setFilter('completed')"
              [class.active]="filter === 'completed'"
            >
              Completed ({{ completedCount }})
            </button>
          </div>

          <!-- Todo list -->
          <div *ngIf="filteredTodos.length > 0" class="todo-list">
            <div *ngFor="let todo of filteredTodos; let i = index" class="todo-item">
              <input
                type="checkbox"
                [checked]="todo.completed"
                (change)="toggleTodo(todo.id)"
              />
              <span [class.completed]="todo.completed">
                {{ todo.title }}
              </span>
              <button (click)="deleteTodo(todo.id)">Delete</button>
            </div>
          </div>

          <!-- Empty state -->
          <div *ngIf="filteredTodos.length === 0" class="empty">
            No todos found
          </div>

          <!-- Footer -->
          <div *ngIf="todos.length > 0" class="footer">
            <span>{{ activeCount }} item{{ activeCount === 1 ? '' : 's' }} left</span>
            <button
              *ngIf="completedCount > 0"
              (click)="clearCompleted()"
            >
              Clear Completed
            </button>
          </div>
        </div>
      `,
      data: {
        title: 'Todo App',
        newTodo: '',
        filter: 'all',
        todos: [],
      },
      services: {
        dataService: DataService,
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
        activeCount: (state) => state.todos.filter((t) => !t.completed).length,
        completedCount: (state) => state.todos.filter((t) => t.completed).length,
      },
      methods: {
        addTodo() {
          if (this.state.newTodo.trim()) {
            this.dataService.addTodo(this.state.newTodo.trim());
            this.setState({ newTodo: '' });
          }
        },
        toggleTodo(id) {
          this.dataService.toggleTodo(id);
        },
        deleteTodo(id) {
          this.dataService.deleteTodo(id);
        },
        setFilter(filter) {
          this.setState({ filter });
        },
        clearCompleted() {
          this.dataService.clearCompleted();
        },
        handleKeyPress(event) {
          if (event.key === 'Enter') {
            this.addTodo();
          }
        },
      },
    });
  }

  onInit() {
    // Subscribe to data service
    this._subscriptions.push(
      this.dataService.todos$.subscribe((todos) => {
        this.setState({ todos });
      })
    );
  }

  onMount() {
    console.log('Todo component mounted');
  }

  onDestroy() {
    console.log('Todo component destroyed');
  }
}
```

## API Reference

### ReactiveComponent

#### Constructor Options

```typescript
{
  selector: string; // CSS selector for mount target
  template: string; // HTML template
  data: Object; // Initial state
  methods: Object; // Component methods
  computed: Object; // Computed properties
  services: Object; // Injected services
}
```

#### Methods

- `setState(updater)` - Update component state
- `updateState(key, value)` - Update single state property
- `emit(eventName, data)` - Emit custom event
- `on(eventName, handler)` - Listen to custom event
- `mount(target)` - Mount component to DOM
- `destroy()` - Destroy component and cleanup

#### Lifecycle Hooks

- `onInit()` - Before mounting
- `onMount()` - After mounted to DOM
- `onChange(state)` - On state change
- `onDestroy()` - Before destruction

### Directives

- `*ngIf="condition"` - Conditional rendering
- `*ngFor="let item of items"` - List rendering
- `[ngSwitch]="value"` + `*ngSwitchCase` - Multiple conditions
- `[ngClass]="classes"` - Dynamic classes
- `[ngStyle]="styles"` - Dynamic styles
- `[class.name]="condition"` - Single class toggle
- `[style.property]="value"` - Single style binding

### Dependency Injection

- `@Service()` - Mark class as injectable service
- `@Injectable()` - Injectable decorator
- `rootInjector` - Root DI container

## Best Practices

1. **Keep Components Small** - Single responsibility principle
2. **Use Services for Logic** - Components should be thin
3. **Leverage Computed Properties** - For derived state
4. **Subscribe in onInit** - And store in `_subscriptions` array
5. **Cleanup on Destroy** - Subscriptions are auto-cleaned if stored properly
6. **Use Reactive Patterns** - Let RxJS handle async operations
7. **Avoid Direct DOM Manipulation** - Use data binding instead

## Browser Support

- Modern browsers with ES2021+ support
- Proxy support required for reactive features

## Dependencies

- RxJS (BehaviorSubject, Subject)

## Examples

See [reactive-demo.html](reactive-demo.html) for live examples including:

- Todo app with full CRUD operations
- Counter with reactive state
- All directive examples
- Service injection
- Lifecycle hooks

## License

MIT
