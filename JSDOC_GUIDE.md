# JSDoc Strict Typing Guide

This project enforces **strict type annotations** using JSDoc comments. All functions, methods,
classes, and exported values must have complete JSDoc documentation with type information.

## Table of Contents

- [Why Strict JSDoc?](#why-strict-jsdoc)
- [Required Documentation](#required-documentation)
- [Type Annotations](#type-annotations)
- [Examples](#examples)
- [Custom Types](#custom-types)
- [Best Practices](#best-practices)

## Why Strict JSDoc?

This project uses vanilla JavaScript (`.js` files only) but enforces TypeScript-like type safety
through JSDoc annotations. Benefits:

- **Type safety** without TypeScript compilation
- **Better IDE support** with autocomplete and type checking
- **Self-documenting code** with inline documentation
- **Catch errors early** during linting
- **No build step overhead** for type compilation

## Required Documentation

### All Functions Must Have

1. **Description** - What the function does
2. **@param** - For each parameter with type and description
3. **@returns** - Return type and description (unless void)
4. **@throws** - If function can throw errors (optional but recommended)

### All Classes Must Have

1. **Class description**
2. **@param** - For constructor parameters
3. **Method documentation** - All methods must have JSDoc

### All Properties Must Have

1. **@property** - Type and description for object properties
2. **@type** - For variables and constants

## Type Annotations

### Primitive Types

```javascript
/**
 * @type {string}
 */
const name = 'John';

/**
 * @type {number}
 */
const age = 30;

/**
 * @type {boolean}
 */
const isActive = true;

/**
 * @type {null}
 */
const nothing = null;

/**
 * @type {undefined}
 */
let unset;
```

### Arrays

```javascript
/**
 * @type {string[]}
 */
const names = ['Alice', 'Bob'];

/**
 * @type {Array<number>}
 */
const numbers = [1, 2, 3];

/**
 * @type {Array<{id: number, name: string}>}
 */
const users = [{ id: 1, name: 'John' }];
```

### Objects

```javascript
/**
 * @type {{name: string, age: number}}
 */
const person = { name: 'John', age: 30 };

/**
 * @type {Object.<string, number>}
 */
const scores = { math: 95, science: 87 };

/**
 * @type {Record<string, any>}
 */
const config = { theme: 'dark', debug: true };
```

### Functions

```javascript
/**
 * Adds two numbers together
 *
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 */
function add(a, b) {
  return a + b;
}

/**
 * Fetches user data from API
 *
 * @param {string} userId - The user ID to fetch
 * @returns {Promise<Object>} User data object
 * @throws {Error} If user not found
 */
async function fetchUser(userId) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}
```

### Optional and Default Parameters

```javascript
/**
 * Creates a greeting message
 *
 * @param {string} name - The person's name
 * @param {string} [greeting='Hello'] - Optional greeting (defaults to 'Hello')
 * @param {boolean} [formal=false] - Whether to use formal greeting
 * @returns {string} The greeting message
 */
function greet(name, greeting = 'Hello', formal = false) {
  const prefix = formal ? 'Dear' : greeting;
  return `${prefix} ${name}`;
}
```

### Union Types

```javascript
/**
 * Processes a value that can be string or number
 *
 * @param {string|number} value - The value to process
 * @returns {string} Processed value as string
 */
function process(value) {
  return String(value);
}

/**
 * @type {('success'|'error'|'pending')}
 */
let status = 'pending';
```

### Nullable Types

```javascript
/**
 * Finds a user by ID
 *
 * @param {number} id - User ID
 * @returns {Object|null} User object or null if not found
 */
function findUser(id) {
  return users.find((u) => u.id === id) || null;
}
```

### Generic Types

```javascript
/**
 * Creates an array with repeated value
 *
 * @template T
 * @param {T} value - The value to repeat
 * @param {number} count - Number of repetitions
 * @returns {T[]} Array of repeated values
 */
function repeat(value, count) {
  return Array(count).fill(value);
}
```

## Examples

### Class Documentation

```javascript
/**
 * Represents a user in the system
 *
 * @class User
 */
class User {
  /**
   * Creates a new User instance
   *
   * @param {string} name - The user's name
   * @param {string} email - The user's email address
   * @param {number} [age] - The user's age (optional)
   */
  constructor(name, email, age) {
    /**
     * @type {string}
     */
    this.name = name;

    /**
     * @type {string}
     */
    this.email = email;

    /**
     * @type {number|undefined}
     */
    this.age = age;
  }

  /**
   * Gets user's display name
   *
   * @returns {string} Formatted display name
   */
  getDisplayName() {
    return this.age ? `${this.name} (${this.age})` : this.name;
  }

  /**
   * Validates user email format
   *
   * @returns {boolean} True if email is valid
   */
  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}
```

### Callback Functions

```javascript
/**
 * Filters array based on predicate
 *
 * @param {Array<*>} array - Input array
 * @param {function(*): boolean} predicate - Filter function
 * @returns {Array<*>} Filtered array
 */
function filter(array, predicate) {
  return array.filter(predicate);
}

/**
 * Event listener callback
 *
 * @callback EventCallback
 * @param {Event} event - The DOM event
 * @returns {void}
 */

/**
 * Adds event listener to element
 *
 * @param {HTMLElement} element - Target element
 * @param {string} eventName - Event name
 * @param {EventCallback} callback - Event handler
 * @returns {void}
 */
function on(element, eventName, callback) {
  element.addEventListener(eventName, callback);
}
```

### Using Custom Types

```javascript
/**
 * Creates a new component instance
 *
 * @param {ComponentOptions} options - Component configuration
 * @returns {Object} Component instance
 * @see {file://./types.js} For ComponentOptions definition
 */
function createComponent(options) {
  // Implementation
}

/**
 * Makes an HTTP request
 *
 * @param {HttpRequestOptions} options - Request configuration
 * @returns {Promise<HttpResponse>} Response promise
 */
function request(options) {
  // Implementation
}
```

## Custom Types

All custom types are defined in [types.js](types.js). Import or reference them in your JSDoc:

### Using Typedef

```javascript
/**
 * @typedef {Object} Point
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */

/**
 * Calculates distance between two points
 *
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {number} Distance between points
 */
function distance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}
```

### Complex Object Types

```javascript
/**
 * @typedef {Object} UserProfile
 * @property {number} id - User ID
 * @property {string} name - Full name
 * @property {string} email - Email address
 * @property {Object} preferences - User preferences
 * @property {string} preferences.theme - UI theme ('light'|'dark')
 * @property {string} preferences.language - Language code
 * @property {boolean} preferences.notifications - Notifications enabled
 * @property {string[]} roles - User roles
 * @property {Date} createdAt - Account creation date
 */
```

## Best Practices

### 1. Always Specify Return Types

```javascript
// ✅ Good
/**
 * Gets user count
 *
 * @returns {number} Number of users
 */
function getUserCount() {
  return users.length;
}

// ❌ Bad - missing @returns
/**
 * Gets user count
 */
function getUserCount() {
  return users.length;
}
```

### 2. Document All Parameters

```javascript
// ✅ Good
/**
 * Updates user profile
 *
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update
 * @param {string} [updates.name] - New name
 * @param {string} [updates.email] - New email
 * @returns {Promise<Object>} Updated user
 */
async function updateUser(userId, updates) {
  // Implementation
}

// ❌ Bad - missing parameter documentation
/**
 * Updates user profile
 */
async function updateUser(userId, updates) {
  // Implementation
}
```

### 3. Use Specific Types

```javascript
// ✅ Good
/**
 * @param {HTMLElement} element - DOM element
 * @param {('show'|'hide'|'toggle')} action - Action to perform
 */
function toggleVisibility(element, action) {
  // Implementation
}

// ❌ Bad - too generic
/**
 * @param {*} element - DOM element
 * @param {string} action - Action
 */
function toggleVisibility(element, action) {
  // Implementation
}
```

### 4. Document Thrown Errors

```javascript
// ✅ Good
/**
 * Parses JSON string
 *
 * @param {string} json - JSON string to parse
 * @returns {Object} Parsed object
 * @throws {SyntaxError} If JSON is invalid
 */
function parseJSON(json) {
  return JSON.parse(json);
}
```

### 5. Use @see for Related Documentation

```javascript
/**
 * Validates form field
 *
 * @param {HTMLInputElement} field - Input field
 * @returns {boolean} Validation result
 * @see {@link validateForm} For form-level validation
 */
function validateField(field) {
  // Implementation
}
```

## Validation

Run strict type checking:

```bash
# Check JSDoc compliance
npm run lint:types

# Fix auto-fixable issues
npm run lint:fix

# Full validation (types + formatting)
npm run validate:strict
```

## Common Errors

### Missing JSDoc

```
error  Missing JSDoc comment  jsdoc/require-jsdoc
```

**Fix:** Add JSDoc comment to function/class

### Missing Parameter Type

```
error  Missing JSDoc @param type  jsdoc/require-param-type
```

**Fix:** Add type annotation to @param

### Missing Return Type

```
error  Missing JSDoc @returns  jsdoc/require-returns
```

**Fix:** Add @returns with type and description

### Undefined Type

```
error  The type 'MyType' is undefined  jsdoc/no-undefined-types
```

**Fix:** Define the type in [types.js](types.js) or add to `definedTypes` in
[eslint.config.js](eslint.config.js)

## Resources

- [JSDoc Official Documentation](https://jsdoc.app/)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Google JavaScript Style Guide - JSDoc](https://google.github.io/styleguide/jsguide.html#jsdoc)
