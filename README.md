# Vanilla JavaScript HTTP Client

A fully-featured HTTP client for vanilla JavaScript with Angular HttpClient feature parity, built on
RxJS Observables and the Fetch API.

## Features

### Core Features

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
- ✅ **TypeScript-ready** - Full JSDoc annotations

### RxJS Operators

- `retry()` - Automatic retry logic
- `timeout()` - Request timeouts
- `catchError()` - Error handling
- `map()` - Transform responses
- And all other RxJS operators!

## Installation

```bash
npm install
```

## Usage

### Basic Example

```javascript
import { HttpClient } from './src/http-client.js';

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

### Run Basic Examples

```bash
npm start
# Opens index.html with basic examples
```

### Run Advanced Examples

Open `index-advanced.html` in your browser to see:

- HttpParams and HttpHeaders usage
- Progress tracking
- Context tokens
- Retry and timeout logic
- Response transformations
- All HTTP methods
- Error handling patterns

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run linter
npm run lint
npm run lint:fix

# Format code
npm run format

# Generate documentation
npm run docs
npm run docs:watch
```

## File Structure

```
src/
├── http-client.js      # Main HTTP client
├── http-params.js      # Query parameter builder
├── http-headers.js     # Header management
├── http-context.js     # Request context
├── http-event.js       # Event types
├── example.js          # Basic examples
└── example-advanced.js # Advanced examples
```

## Browser Support

- Modern browsers with ES2021+ support
- Fetch API support
- XMLHttpRequest for progress tracking
- Native Promise support

## License

ISC
