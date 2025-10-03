/**
 * @file Type definitions for the vanilla JavaScript project
 * This file contains JSDoc typedef declarations for custom types used throughout the application.
 * Import this file or reference types using @typedef in your JSDoc comments.
 */

/**
 * @typedef {object} ComponentOptions
 * @property {string} [selector] - CSS selector for the component element
 * @property {HTMLElement} [element] - Direct element reference
 * @property {string} [template] - HTML template string
 * @property {Object.<string, *>} [data] - Initial data for the component
 * @property {Object.<string, Function>} [methods] - Component methods
 * @property {Object.<string, Function>} [computed] - Computed properties
 * @property {Function} [onInit] - Lifecycle hook: called on initialization
 * @property {Function} [onMount] - Lifecycle hook: called after mount
 * @property {Function} [onChange] - Lifecycle hook: called on data change
 * @property {Function} [onDestroy] - Lifecycle hook: called on destroy
 */

/**
 * @typedef {object} ReactiveComponentOptions
 * @property {string} [selector] - CSS selector for the component element
 * @property {HTMLElement} [element] - Direct element reference
 * @property {string} [template] - HTML template string
 * @property {Object.<string, *>} [state] - Reactive state object
 * @property {Object.<string, Function>} [methods] - Component methods
 * @property {Object.<string, Function>} [computed] - Computed properties
 */

/**
 * @typedef {object} HttpRequestOptions
 * @property {string} url - The URL to request
 * @property {string} [method='GET'] - HTTP method
 * @property {Object.<string, string>} [headers] - Request headers
 * @property {*} [body] - Request body
 * @property {Object.<string, string|number|boolean>} [params] - URL query parameters
 * @property {'arraybuffer'|'blob'|'document'|'json'|'text'} [responseType='json'] - Expected response type
 * @property {boolean} [withCredentials=false] - Include credentials in request
 * @property {number} [timeout=0] - Request timeout in milliseconds
 * @property {HttpContext} [context] - Additional context data
 */

/**
 * @typedef {object} HttpResponse
 * @property {*} body - Response body
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {Object.<string, string>} headers - Response headers
 * @property {string} url - Final URL after redirects
 * @property {boolean} ok - Whether status is 200-299
 */

/**
 * @typedef {object} HttpErrorResponse
 * @property {*} error - Error details
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {Object.<string, string>} headers - Response headers
 * @property {string} url - Request URL
 * @property {string} message - Error message
 */

/**
 * @typedef {object} HttpInterceptor
 * @property {Function} [request] - Intercept and modify requests
 * @property {Function} [response] - Intercept and modify responses
 * @property {Function} [error] - Intercept and handle errors
 */

/**
 * @typedef {object} ValidationRule
 * @property {string} type - Type of validation (required, email, min, max, pattern, etc.)
 * @property {*} [value] - Rule value (e.g., min length, max value, regex pattern)
 * @property {string} message - Error message when validation fails
 */

/**
 * @typedef {object} FormFieldConfig
 * @property {string} name - Field name
 * @property {ValidationRule[]} [rules] - Validation rules
 * @property {*} [defaultValue] - Default field value
 * @property {Function} [transform] - Transform function for field value
 */

/**
 * @typedef {object} FormValidationResult
 * @property {boolean} valid - Whether the form is valid
 * @property {Object.<string, string[]>} errors - Validation errors by field name
 * @property {Object.<string, *>} values - Form field values
 */

/**
 * @typedef {object} I18nConfig
 * @property {string} defaultLocale - Default locale code (e.g., 'en', 'es')
 * @property {string} [fallbackLocale] - Fallback locale when translation missing
 * @property {string[]} [supportedLocales] - List of supported locale codes
 * @property {string} [translationsPath='/i18n'] - Path to translation files
 * @property {boolean} [debug=false] - Enable debug logging
 */

/**
 * @typedef {object} TranslationParams
 * @property {Object.<string, string|number>} [params] - Interpolation parameters
 * @property {number} [count] - Count for pluralization
 * @property {string} [locale] - Specific locale to use
 */

/**
 * @typedef {object} ThemeConfig
 * @property {string} [defaultTheme='light'] - Default theme
 * @property {string} [storageKey='theme'] - LocalStorage key for theme
 * @property {boolean} [autoDetect=true] - Auto-detect system theme preference
 * @property {string} [attribute='data-theme'] - HTML attribute for theme
 * @property {Object.<string, string>} [themes] - Theme name to class mappings
 */

/**
 * @typedef {object} BreakpointConfig
 * @property {string} name - Breakpoint name (e.g., 'mobile', 'tablet', 'desktop')
 * @property {string} query - Media query string
 * @property {Function} [callback] - Callback when breakpoint matches
 */

/**
 * @typedef {object} DirectiveContext
 * @property {HTMLElement} element - The element with the directive
 * @property {*} value - The directive value
 * @property {string} expression - The original expression
 * @property {object} [modifiers] - Directive modifiers
 */

/**
 * @typedef {object} ServiceProvider
 * @property {string|symbol} token - Service identifier token
 * @property {Function|*} useClass - Class constructor to instantiate
 * @property {*} [useValue] - Direct value to provide
 * @property {Function} [useFactory] - Factory function to create service
 * @property {Array.<string|symbol>} [deps] - Dependencies for factory
 * @property {boolean} [singleton=true] - Whether to cache instance
 */

/**
 * @typedef {object} InjectorOptions
 * @property {ServiceProvider[]} [providers] - Service providers to register
 * @property {object} [parent] - Parent injector for hierarchical DI
 */

/**
 * @typedef {object} HttpParams
 * @property {Map<string, string|string[]>} map - Internal parameter map
 * @property {Function} set - Set a parameter value
 * @property {Function} get - Get a parameter value
 * @property {Function} has - Check if parameter exists
 * @property {Function} delete - Delete a parameter
 * @property {Function} toString - Convert to query string
 */

/**
 * @typedef {object} HttpHeaders
 * @property {Map<string, string|string[]>} map - Internal header map
 * @property {Function} set - Set a header value
 * @property {Function} get - Get a header value
 * @property {Function} has - Check if header exists
 * @property {Function} delete - Delete a header
 */

/**
 * @typedef {object} HttpContext
 * @property {Map<*, *>} map - Internal context map
 * @property {Function} set - Set a context value
 * @property {Function} get - Get a context value
 * @property {Function} has - Check if context key exists
 */

/**
 * @typedef {object} ManifestComponent
 * @property {string} name - Component name
 * @property {string} path - Path to component file
 * @property {string[]} [dependencies] - Component dependencies
 * @property {boolean} [lazy=false] - Whether to lazy load
 */

/**
 * @typedef {object} ComponentManifest
 * @property {string} version - Manifest version
 * @property {ManifestComponent[]} components - List of components
 * @property {Object.<string, string>} [aliases] - Component name aliases
 */

/**
 * Global RxJS Observable types (from packages/rxjs)
 * @external Observable
 * @see {@link https://rxjs.dev/api/index/class/Observable}
 */

/**
 * @external Subscription
 * @see {@link https://rxjs.dev/api/index/class/Subscription}
 */

/**
 * @external Subject
 * @see {@link https://rxjs.dev/api/index/class/Subject}
 */

/**
 * @external BehaviorSubject
 * @see {@link https://rxjs.dev/api/index/class/BehaviorSubject}
 */

// Export nothing - this is just a type definition file
export {};
