# Vanilla JavaScript Framework

A comprehensive, zero-dependency framework for building modern web applications with vanilla
JavaScript. Features a component-based architecture, reactive data binding, dependency injection,
internationalization, and complete tooling for professional web development.

## Features

### Component System

- ✅ **Base Components** - Lifecycle hooks, DOM rendering, event handling
- ✅ **Reactive Components** - Automatic data binding and state management
- ✅ **DOM Directives** - Declarative templates with custom directives
- ✅ **Manifest Loading** - Dynamic component loading with manifests

### HTTP Client (Angular HttpClient Feature Parity)

- ✅ **Observable-based** - RxJS Observables for reactive programming
- ✅ **Request/Response Interceptors** - Modify requests and responses
- ✅ **HttpParams** - Immutable query string builder
- ✅ **HttpHeaders** - Immutable header management
- ✅ **HttpContext** - Request metadata and context tokens
- ✅ **Progress Events** - Upload and download progress tracking
- ✅ **Multiple Response Types** - json, text, blob, arraybuffer
- ✅ **Observe Options** - body, response, or events
- ✅ **Error Handling** - Structured error responses
- ✅ **CORS Support** - withCredentials for cross-origin requests
- ✅ **All HTTP Methods** - GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- ✅ **JSONP Support** - For legacy cross-origin requests

### Forms & Validation

- ✅ **Form Validation Framework** - Custom validators and error handling
- ✅ **Built-in Validators** - Required, email, pattern, min/max, etc.
- ✅ **Async Validation** - Server-side validation support
- ✅ **Error Messages** - Centralized validation message management

### Internationalization (i18n)

- ✅ **Multi-language Support** - Dynamic locale switching
- ✅ **Translation Engine** - Key-based translation system
- ✅ **Locale Management** - Load and switch languages at runtime
- ✅ **Helper Utilities** - i18n directives and formatters

### Dependency Injection

- ✅ **Service Container** - Register and resolve dependencies
- ✅ **Singleton Management** - Automatic service lifecycle
- ✅ **Token-based Injection** - Type-safe dependency resolution

### UI & Theming

- ✅ **Theme Manager** - Dark/light mode switching
- ✅ **Breakpoint Observer** - Responsive design utilities
- ✅ **Design System** - CSS custom properties and design tokens
- ✅ **Grid System** - Flexible CSS grid layout
- ✅ **Animation Utilities** - Pre-built CSS animations
- ✅ **Typography System** - Consistent text styling
- ✅ **UI Components** - Reusable styled components

### Development Tools

- ✅ **Build System** - esbuild for fast bundling
- ✅ **Code Minification** - Terser (JS) and CSSO (CSS)
- ✅ **Live Reload** - Development server with hot reload
- ✅ **Multi-format Linting** - ESLint, Stylelint, HTMLHint, Markdownlint
- ✅ **Code Formatting** - Prettier integration
- ✅ **JSDoc Generation** - Automatic documentation
- ✅ **TypeScript-ready** - Full JSDoc annotations

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build && npm run bundle && npm run minify
```

## Usage Examples

### Component System

```javascript
import { Component } from './src/js/component.js';
import { ReactiveComponent } from './src/js/reactive-component.js';

// Basic component
class MyComponent extends Component {
  onInit() {
    this.element.innerHTML = '<h1>Hello World</h1>';
  }
}

// Reactive component with data binding
class CounterComponent extends ReactiveComponent {
  constructor(element) {
    super(element);
    this.state = { count: 0 };
  }

  template() {
    return `<button onclick="this.increment()">Count: ${this.state.count}</button>`;
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }
}
```

### HTTP Client

```javascript
import { HttpClient } from './src/js/http-client.js';

const client = new HttpClient({
  baseUrl: 'https://api.example.com',
  defaultHeaders: { 'X-App-Version': '1.0.0' },
});

// Simple GET request
client.get('/users/1').subscribe({
  next: (user) => console.log(user),
  error: (error) => console.error(error),
  complete: () => console.log('Done'),
});

// POST with body
client.post('/users', { name: 'John', email: 'john@example.com' }).subscribe({
  next: (response) => console.log('Created:', response),
});
```

### HttpParams - Query Strings

```javascript
import { HttpParams } from './src/http-params.js';

const params = new HttpParams()
  .set('page', '1')
  .set('limit', '10')
  .append('sort', 'name')
  .append('sort', 'date');

client.get('/users', { params }).subscribe((users) => {
  console.log(users);
});

// URL: /users?page=1&limit=10&sort=name&sort=date
```

### HttpHeaders - Header Management

```javascript
import { HttpHeaders } from './src/http-headers.js';

const headers = new HttpHeaders()
  .set('Authorization', 'Bearer token123')
  .set('Content-Type', 'application/json')
  .append('X-Custom', 'value1')
  .append('X-Custom', 'value2');

client.get('/protected', { headers }).subscribe((data) => {
  console.log(data);
});
```

### HttpContext - Request Metadata

```javascript
import { HttpContext, HttpContextToken } from './src/http-context.js';

// Define context tokens
const CACHE_ENABLED = new HttpContextToken(false);
const RETRY_COUNT = new HttpContextToken(3);

const context = new HttpContext().set(CACHE_ENABLED, true).set(RETRY_COUNT, 5);

client.get('/data', { context }).subscribe((data) => {
  // Interceptors can read context values
  console.log(data);
});
```

### Progress Events

```javascript
import { HttpEventType } from './src/http-event.js';

client
  .post('/upload', formData, {
    reportProgress: true,
    observe: 'events',
  })
  .subscribe({
    next: (event) => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log(`Upload: ${event.progress}%`);
      } else if (event.type === HttpEventType.Response) {
        console.log('Complete:', event.body);
      }
    },
  });
```

### Interceptors

```javascript
// Request interceptor
client.addRequestInterceptor((url, options, context) => {
  // Add auth token
  options.headers['Authorization'] = 'Bearer ' + getToken();
  return { url, options };
});

// Response interceptor
client.addResponseInterceptor((response, context) => {
  // Log or transform response
  console.log('Response:', response.status);
  return response;
});
```

### Response Types

```javascript
// Get full response object
client.get('/data', { observe: 'response' }).subscribe((response) => {
  console.log(response.status);
  console.log(response.headers);
  console.log(response.body);
});

// Get events stream
client.get('/data', { observe: 'events' }).subscribe((event) => {
  console.log(event.type);
});

// Different response types
client.get('/text', { responseType: 'text' }).subscribe((text) => {});
client.get('/image', { responseType: 'blob' }).subscribe((blob) => {});
client.get('/binary', { responseType: 'arraybuffer' }).subscribe((buffer) => {});
```

### Error Handling with RxJS

```javascript
import { retry, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

client
  .get('/data')
  .pipe(
    timeout(5000), // 5 second timeout
    retry(3), // Retry 3 times
    catchError((error) => {
      console.error('Failed:', error);
      return of({ default: 'fallback' });
    })
  )
  .subscribe((data) => console.log(data));
```

### Transform Responses

```javascript
import { map } from 'rxjs/operators';

client
  .get('/users')
  .pipe(
    map((users) => users.filter((u) => u.active)),
    map((users) => users.map((u) => u.name))
  )
  .subscribe((names) => console.log(names));
```

### Form Validation

```javascript
import { FormValidator } from './src/js/forms.js';

const validator = new FormValidator(formElement);

validator.addRule('email', {
  required: true,
  email: true,
  message: 'Valid email required',
});

if (validator.validate()) {
  console.log('Form is valid!');
}
```

### Internationalization

```javascript
import { I18n } from './src/js/i18n.js';

const i18n = new I18n();
await i18n.loadLocale('en', '/i18n/en.json');
await i18n.loadLocale('es', '/i18n/es.json');

i18n.setLocale('es');
console.log(i18n.t('welcome.message')); // Translated message
```

### Dependency Injection

```javascript
import { Injector } from './src/js/injector.js';

const injector = new Injector();

// Register services
injector.register('apiService', () => new ApiService());
injector.register('userService', (injector) => {
  const api = injector.resolve('apiService');
  return new UserService(api);
});

// Resolve dependencies
const userService = injector.resolve('userService');
```

### Theme Management

```javascript
import { ThemeManager } from './src/js/theme-manager.js';

const themeManager = new ThemeManager();

// Switch to dark mode
themeManager.setTheme('dark');

// Toggle theme
themeManager.toggleTheme();
```

### Breakpoint Observer

```javascript
import { BreakpointObserver } from './src/js/breakpoint-observer.js';

const observer = new BreakpointObserver();

observer.observe(['mobile', 'tablet', 'desktop']).subscribe((state) => {
  console.log('Current breakpoint:', state.activeBreakpoint);
});
```

## Project Structure

```
/var/www/html/vanillajs/
├── src/                    # Source code
│   ├── js/                 # JavaScript modules
│   │   ├── component.js              # Base component system
│   │   ├── reactive-component.js     # Reactive data binding
│   │   ├── directives.js             # DOM directives
│   │   ├── forms.js                  # Form validation
│   │   ├── http-client.js            # HTTP client
│   │   ├── i18n.js                   # Internationalization
│   │   ├── i18n-helpers.js           # i18n utilities
│   │   ├── injector.js               # Dependency injection
│   │   ├── breakpoint-observer.js    # Responsive utilities
│   │   ├── theme-manager.js          # Theme switching
│   │   └── manifest-loader.js        # Component manifests
│   └── css/                # Stylesheets
│       ├── all.css                   # Main CSS entry
│       ├── design-system.css         # Design tokens
│       ├── ui-components.css         # Component styles
│       ├── grid-system.css           # Layout grid
│       ├── animations.css            # Animations
│       ├── typography-utilities.css  # Text utilities
│       └── utility-classes.css       # Helper classes
├── examples/               # Demo files
├── scripts/                # Build automation
├── dist/                   # Build output
├── docs/                   # JSDoc documentation
└── i18n/                   # Translation files
```

## API Reference

### HttpClient

#### Constructor

```javascript
new HttpClient(config?: {
  baseUrl?: string,
  defaultHeaders?: HttpHeaders | object
})
```

#### Methods

- `get(url, options?)` - GET request
- `post(url, body, options?)` - POST request
- `put(url, body, options?)` - PUT request
- `patch(url, body, options?)` - PATCH request
- `delete(url, options?)` - DELETE request
- `head(url, options?)` - HEAD request
- `options(url, options?)` - OPTIONS request
- `jsonp(url, callbackParam?)` - JSONP request
- `request(method, url, options?)` - Generic request

#### Options

```typescript
{
  headers?: HttpHeaders | object,
  params?: HttpParams | object,
  body?: any,
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer',
  observe?: 'body' | 'response' | 'events',
  reportProgress?: boolean,
  withCredentials?: boolean,
  context?: HttpContext
}
```

### HttpParams

Immutable query parameter builder.

```javascript
const params = new HttpParams()
  .set(key, value) // Set parameter
  .append(key, value) // Append parameter
  .delete(key) // Delete parameter
  .has(key) // Check if exists
  .get(key) // Get first value
  .getAll(key) // Get all values
  .keys() // Get all keys
  .toString(); // Convert to string
```

### HttpHeaders

Immutable header builder.

```javascript
const headers = new HttpHeaders()
  .set(name, value) // Set header
  .append(name, value) // Append header
  .delete(name) // Delete header
  .has(name) // Check if exists
  .get(name) // Get first value
  .getAll(name) // Get all values
  .keys(); // Get all keys
```

### HttpContext

Request metadata storage.

```javascript
const token = new HttpContextToken(defaultValue);
const context = new HttpContext()
  .set(token, value) // Store value
  .get(token) // Retrieve value
  .has(token) // Check if exists
  .delete(token); // Delete value
```

## Examples

Check the [examples/](examples/) directory for comprehensive demos:

- **counter.component.js** - Basic component example
- **todo.component.js** - Todo app with reactive state
- **forms-example.html** - Form validation demo
- **i18n-demo.html** - Multi-language support
- **design-system-demo.html** - UI components showcase
- **breakpoint-example.html** - Responsive breakpoints
- **reactive-demo.html** - Reactive data binding

### Run Examples

```bash
npm start  # Opens index.html with live reload
```

## Development

```bash
# Development server
npm start              # Opens index.html with live reload
npm run dev           # Starts server without opening browser

# Build & bundle
npm run build         # Run build script
npm run build:watch   # Watch mode for builds
npm run bundle        # Bundle with esbuild
npm run minify        # Minify code (terser/csso)
npm run clean         # Remove dist directory

# Code quality
npm run validate      # Run all linters + format check
npm run lint          # Check all (JS, CSS, HTML, MD)
npm run lint:fix      # Auto-fix JS, CSS, and format
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without changes

# Documentation
npm run docs          # Generate JSDoc documentation
npm run docs:watch    # Auto-regenerate docs on changes
```

## Code Standards

- **ES Modules**: Modern `import`/`export` syntax
- **JSDoc**: Complete documentation for all functions
- **Prettier**: Single quotes, semicolons, 2-space indentation
- **ESLint**: Code quality validation
- **Browser**: ES2021+ features, no transpilation needed

## Browser Support

- Modern browsers with ES2021+ support (Chrome 90+, Firefox 88+, Safari 14.1+, Edge 90+)
- Native ES modules support
- Fetch API and XMLHttpRequest
- CSS Custom Properties (CSS Variables)
- No polyfills required for target browsers

## Architecture

This framework follows a modular, component-based architecture inspired by modern frameworks like
Angular and Vue, but built entirely with vanilla JavaScript:

- **Zero Dependencies** (except RxJS for reactive programming)
- **No Build Step Required** (optional bundling for production)
- **Framework Agnostic** (use standalone or integrate with existing projects)
- **Progressive Enhancement** (works with or without JavaScript)

## Contributing

1. Follow the code standards outlined in [CLAUDE.md](CLAUDE.md)
2. Run `npm run validate` before committing
3. Add JSDoc comments for all new functions
4. Update examples when adding new features

## License

ISC
