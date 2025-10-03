import { Observable } from '../../packages/rxjs/esm/internal/Observable.js';

/**
 * HTTP request options
 * @typedef {object} HttpOptions
 * @property {HttpHeaders|Object.<string, string>} [headers] - Request headers
 * @property {HttpParams | object} [params] - Query parameters
 * @property {*} [body] - Request body
 * @property {string} [responseType='json'] - Expected response type ('json', 'text', 'blob', 'arraybuffer')
 * @property {string} [observe='body'] - What to observe ('body', 'response', 'events')
 * @property {boolean} [reportProgress=false] - Whether to report progress events
 * @property {boolean} [withCredentials=false] - Whether to send credentials
 * @property {HttpContext} [context] - Request context for metadata
 */

/**
 * Request interceptor function
 * @callback RequestInterceptor
 * @param {string} url - Request URL
 * @param {RequestInit} options - Fetch options
 * @param {HttpContext} context - Request context
 * @returns {{url: string, options: RequestInit}} Modified request
 */

/**
 * Response interceptor function
 * @callback ResponseInterceptor
 * @param {HttpResponse|HttpErrorResponse} response - HTTP response
 * @param {HttpContext} context - Request context
 * @returns {HttpResponse|HttpErrorResponse} Modified response
 */

/**
 * HTTP Client for making HTTP requests using RxJS Observables
 * Similar to Angular's HttpClient with full feature parity
 */
export class HttpClient {
  /**
   * Creates an instance of HttpClient
   * @param {object} [config] - Configuration options
   * @param {HttpHeaders|Object.<string, string>} [config.defaultHeaders] - Default headers for all requests
   * @param {string} [config.baseUrl] - Base URL for all requests
   */
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || '';
    this.defaultHeaders =
      config.defaultHeaders instanceof HttpHeaders
        ? config.defaultHeaders
        : new HttpHeaders(config.defaultHeaders || {});
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Add a request interceptor
   * @param {RequestInterceptor} interceptor - Request interceptor function
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor
   * @param {ResponseInterceptor} interceptor - Response interceptor function
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Build full URL with query parameters
   * @private
   * @param {string} url - URL path
   * @param {HttpParams} [params] - Query parameters
   * @returns {string} Full URL with query string
   */
  _buildUrl(url, params) {
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = this.baseUrl + url;
    }

    if (params && params.toString()) {
      const separator = fullUrl.includes('?') ? '&' : '?';
      fullUrl += separator + params.toString();
    }

    return fullUrl;
  }

  /**
   * Merge headers with defaults
   * @private
   * @param {HttpHeaders | object} [headers] - Custom headers
   * @returns {HttpHeaders} Merged headers
   */
  _buildHeaders(headers) {
    let result = this.defaultHeaders;

    if (headers) {
      if (headers instanceof HttpHeaders) {
        headers.keys().forEach((key) => {
          const values = headers.getAll(key);
          values.forEach((value) => {
            result = result.append(key, value);
          });
        });
      } else {
        Object.entries(headers).forEach(([key, value]) => {
          result = result.set(key, value);
        });
      }
    }

    return result;
  }

  /**
   * Apply request interceptors
   * @private
   * @param {string} url - Request URL
   * @param {RequestInit} options - Fetch options
   * @param {HttpContext} context - Request context
   * @returns {{url: string, options: RequestInit}} Modified request
   */
  _applyRequestInterceptors(url, options, context) {
    let result = { url, options };
    for (const interceptor of this.requestInterceptors) {
      result = interceptor(result.url, result.options, context);
    }
    return result;
  }

  /**
   * Apply response interceptors
   * @private
   * @param {HttpResponse|HttpErrorResponse} response - HTTP response
   * @param {HttpContext} context - Request context
   * @returns {HttpResponse|HttpErrorResponse} Modified response
   */
  _applyResponseInterceptors(response, context) {
    let result = response;
    for (const interceptor of this.responseInterceptors) {
      result = interceptor(result, context);
    }
    return result;
  }

  /**
   * Parse response body based on response type
   * @private
   * @param {Response} response - Fetch response
   * @param {string} responseType - Expected response type
   * @returns {Promise<*>} Parsed response body
   */
  async _parseResponse(response, responseType) {
    if (responseType === 'json') {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }
    if (responseType === 'text') {
      return response.text();
    }
    if (responseType === 'blob') {
      return response.blob();
    }
    if (responseType === 'arraybuffer') {
      return response.arrayBuffer();
    }
    return response.text();
  }

  /**
   * Create XMLHttpRequest for progress tracking
   * @private
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {HttpHeaders} headers - Request headers
   * @param {*} body - Request body
   * @param {string} responseType - Response type
   * @param {boolean} withCredentials - Send credentials
   * @returns {Observable} Observable with progress events
   */
  _requestWithProgress(
    method,
    url,
    headers,
    body,
    responseType,
    withCredentials
  ) {
    return new Observable((observer) => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, url, true);

      // Set headers
      headers.keys().forEach((key) => {
        const value = headers.get(key);
        if (value) {
          xhr.setRequestHeader(key, value);
        }
      });

      // Set response type
      if (responseType !== 'json') {
        xhr.responseType = responseType;
      }

      // Set credentials
      xhr.withCredentials = withCredentials;

      // Sent event
      observer.next(new HttpSentEvent());

      // Upload progress
      if (xhr.upload) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            observer.next(
              new HttpDownloadProgressEvent(event.loaded, event.total)
            );
          }
        });
      }

      // Download progress
      xhr.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          observer.next(
            new HttpDownloadProgressEvent(event.loaded, event.total)
          );
        }
      });

      // Response headers received
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 2) {
          // HEADERS_RECEIVED
          observer.next(
            new HttpHeaderResponse(
              xhr.status,
              xhr.statusText,
              this._parseXHRHeaders(xhr.getAllResponseHeaders())
            )
          );
        }
      });

      // Load complete
      xhr.addEventListener('load', () => {
        let body = xhr.response;
        if (responseType === 'json' && typeof body === 'string') {
          try {
            body = body ? JSON.parse(body) : null;
          } catch (e) {
            body = null;
          }
        }

        const response = new HttpResponse(
          body,
          xhr.status,
          xhr.statusText,
          this._parseXHRHeaders(xhr.getAllResponseHeaders()),
          url
        );

        if (xhr.status >= 200 && xhr.status < 300) {
          observer.next(response);
          observer.complete();
        } else {
          observer.error(
            new HttpErrorResponse(
              xhr.status,
              xhr.statusText,
              body,
              response.headers,
              url
            )
          );
        }
      });

      // Error
      xhr.addEventListener('error', () => {
        observer.error(
          new HttpErrorResponse(0, 'Network Error', null, new Headers(), url)
        );
      });

      // Abort
      xhr.addEventListener('abort', () => {
        observer.error(
          new HttpErrorResponse(0, 'Request Aborted', null, new Headers(), url)
        );
      });

      // Timeout
      xhr.addEventListener('timeout', () => {
        observer.error(
          new HttpErrorResponse(0, 'Request Timeout', null, new Headers(), url)
        );
      });

      // Send request
      xhr.send(body);

      // Cleanup
      return () => {
        xhr.abort();
      };
    });
  }

  /**
   * Parse XHR headers string to Headers object
   * @private
   * @param {string} headersString - Raw headers string
   * @returns {Headers} Parsed headers
   */
  _parseXHRHeaders(headersString) {
    const headers = new Headers();
    if (!headersString) {
      return headers;
    }

    headersString.split('\r\n').forEach((line) => {
      const index = line.indexOf(':');
      if (index > 0) {
        const key = line.substring(0, index).trim();
        const value = line.substring(index + 1).trim();
        headers.append(key, value);
      }
    });

    return headers;
  }

  /**
   * Make an HTTP request
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {HttpOptions} [options] - Request options
   * @returns {Observable} Observable of HTTP response
   */
  request(method, url, options = {}) {
    // Parse options
    const params =
      options.params instanceof HttpParams
        ? options.params
        : options.params
          ? HttpParams.fromObject(options.params)
          : null;

    const headers = this._buildHeaders(options.headers);
    const responseType = options.responseType || 'json';
    const observe = options.observe || 'body';
    const reportProgress = options.reportProgress || false;
    const withCredentials = options.withCredentials || false;
    const context = options.context || new HttpContext();

    const fullUrl = this._buildUrl(url, params);

    // Prepare body
    let { body } = options;
    let finalHeaders = headers;

    if (body && method !== 'GET' && method !== 'HEAD') {
      if (
        typeof body === 'object' &&
        !(body instanceof FormData) &&
        !(body instanceof Blob) &&
        !(body instanceof ArrayBuffer)
      ) {
        body = JSON.stringify(body);
        if (!finalHeaders.has('Content-Type')) {
          finalHeaders = finalHeaders.set('Content-Type', 'application/json');
        }
      }
    }

    // Use XHR for progress tracking
    if (reportProgress || observe === 'events') {
      const xhr$ = this._requestWithProgress(
        method,
        fullUrl,
        finalHeaders,
        body,
        responseType,
        withCredentials
      );

      return new Observable((observer) => {
        const subscription = xhr$.subscribe({
          next: (event) => {
            const interceptedEvent = this._applyResponseInterceptors(
              event,
              context
            );

            if (observe === 'events') {
              observer.next(interceptedEvent);
            } else if (
              observe === 'response' &&
              event instanceof HttpResponse
            ) {
              observer.next(interceptedEvent);
            } else if (observe === 'body' && event instanceof HttpResponse) {
              observer.next(interceptedEvent.body);
            }
          },
          error: (error) => {
            observer.error(this._applyResponseInterceptors(error, context));
          },
          complete: () => {
            observer.complete();
          },
        });

        return () => subscription.unsubscribe();
      });
    }

    // Use Fetch API for simple requests
    return new Observable((observer) => {
      const fetchOptions = {
        method,
        headers: finalHeaders.toObject(),
        credentials: withCredentials ? 'include' : 'same-origin',
      };

      if (body && method !== 'GET' && method !== 'HEAD') {
        fetchOptions.body = body;
      }

      // Apply request interceptors
      const intercepted = this._applyRequestInterceptors(
        fullUrl,
        fetchOptions,
        context
      );

      fetch(intercepted.url, intercepted.options)
        .then(async (response) => {
          const parsedBody = await this._parseResponse(response, responseType);

          const httpResponse = new HttpResponse(
            parsedBody,
            response.status,
            response.statusText,
            response.headers,
            response.url
          );

          if (response.ok) {
            const interceptedResponse = this._applyResponseInterceptors(
              httpResponse,
              context
            );

            if (observe === 'response' || observe === 'events') {
              observer.next(interceptedResponse);
            } else {
              observer.next(interceptedResponse.body);
            }
            observer.complete();
          } else {
            const errorResponse = new HttpErrorResponse(
              response.status,
              response.statusText,
              parsedBody,
              response.headers,
              response.url
            );
            observer.error(
              this._applyResponseInterceptors(errorResponse, context)
            );
          }
        })
        .catch((error) => {
          const errorResponse = new HttpErrorResponse(
            0,
            error.message,
            null,
            new Headers(),
            fullUrl
          );
          observer.error(
            this._applyResponseInterceptors(errorResponse, context)
          );
        });
    });
  }

  /**
   * Make a GET request
   * @param {string} url - Request URL
   * @param {HttpOptions} [options] - Request options
   * @returns {Observable} Observable of HTTP response
   */
  get(url, options = {}) {
    return this.request('GET', url, options);
  }

  /**
   * Make a POST request
   * @param {string} url - Request URL
   * @param {*} body - Request body
   * @param {HttpOptions} [options] - Request options
   * @returns {Observable} Observable of HTTP response
   */
  post(url, body, options = {}) {
    return this.request('POST', url, { ...options, body });
  }

  /**
   * Make a PUT request
   * @param {string} url - Request URL
   * @param {*} body - Request body
   * @param {HttpOptions} [options] - Request options
   * @returns {Observable} Observable of HTTP response
   */
  put(url, body, options = {}) {
    return this.request('PUT', url, { ...options, body });
  }

  /**
   * Make a PATCH request
   * @param {string} url - Request URL
   * @param {*} body - Request body
   * @param {HttpOptions} [options] - Request options
   * @returns {Observable} Observable of HTTP response
   */
  patch(url, body, options = {}) {
    return this.request('PATCH', url, { ...options, body });
  }

  /**
   * Make a DELETE request
   * @param {string} url - Request URL
   * @param {HttpOptions} [options] - Request options
   * @returns {Observable} Observable of HTTP response
   */
  delete(url, options = {}) {
    return this.request('DELETE', url, options);
  }

  /**
   * Make a HEAD request
   * @param {string} url - Request URL
   * @param {HttpOptions} [options] - Request options
   * @returns {Observable} Observable of HTTP response
   */
  head(url, options = {}) {
    return this.request('HEAD', url, options);
  }

  /**
   * Make an OPTIONS request
   * @param {string} url - Request URL
   * @param {HttpOptions} [options] - Request options
   * @returns {Observable} Observable of HTTP response
   */
  options(url, options = {}) {
    return this.request('OPTIONS', url, options);
  }

  /**
   * Make a JSONP request
   * @param {string} url - Request URL
   * @param {string} [callbackParam] - Callback parameter name
   * @returns {Observable} Observable of response body
   */
  jsonp(url, callbackParam = 'callback') {
    return new Observable((observer) => {
      const callbackName = `jsonp_callback_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      window[callbackName] = (data) => {
        observer.next(data);
        observer.complete();
        delete window[callbackName];
        document.body.removeChild(script);
      };

      const separator = url.includes('?') ? '&' : '?';
      const script = document.createElement('script');
      script.src = `${url}${separator}${callbackParam}=${callbackName}`;
      script.onerror = () => {
        observer.error(
          new HttpErrorResponse(
            0,
            'JSONP request failed',
            null,
            new Headers(),
            url
          )
        );
        delete window[callbackName];
        document.body.removeChild(script);
      };

      document.body.appendChild(script);

      return () => {
        if (window[callbackName]) {
          delete window[callbackName];
        }
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
    });
  }
}

/**
 * HTTP context token for storing metadata
 * Similar to Angular's HttpContextToken
 */
export class HttpContextToken {
  /**
   * Creates a context token
   * @param {*} defaultValue - Default value for this token
   */
  constructor(defaultValue) {
    this.defaultValue = defaultValue;
    this._id = Symbol('HttpContextToken');
  }
}

/**
 * HTTP context for storing request metadata
 * Similar to Angular's HttpContext
 */
export class HttpContext {
  /**
   * Creates an HTTP context
   */
  constructor() {
    this._storage = new Map();
  }

  /**
   * Store a value for a token
   * @param {HttpContextToken} token - Context token
   * @param {*} value - Value to store
   * @returns {HttpContext} This context (for chaining)
   */
  set(token, value) {
    this._storage.set(token._id, value);
    return this;
  }

  /**
   * Retrieve a value for a token
   * @param {HttpContextToken} token - Context token
   * @returns {*} Stored value or default
   */
  get(token) {
    if (this._storage.has(token._id)) {
      return this._storage.get(token._id);
    }
    return token.defaultValue;
  }

  /**
   * Check if a token has been set
   * @param {HttpContextToken} token - Context token
   * @returns {boolean} True if token has been set
   */
  has(token) {
    return this._storage.has(token._id);
  }

  /**
   * Delete a token's value
   * @param {HttpContextToken} token - Context token
   * @returns {boolean} True if token was deleted
   */
  delete(token) {
    return this._storage.delete(token._id);
  }

  /**
   * Get all stored tokens
   * @returns {symbol[]} Array of token IDs
   */
  keys() {
    return Array.from(this._storage.keys());
  }
}

/**
 * HTTP event types
 * @enum {string}
 */
export const HttpEventType = {
  Sent: 'Sent',
  UploadProgress: 'UploadProgress',
  ResponseHeader: 'ResponseHeader',
  DownloadProgress: 'DownloadProgress',
  Response: 'Response',
  User: 'User',
};

/**
 * Base HTTP event
 * @typedef {object} HttpEvent
 * @property {string} type - Event type
 */

/**
 * HTTP Sent event - request has been dispatched
 */
export class HttpSentEvent {
  /**
   *
   */
  constructor() {
    this.type = HttpEventType.Sent;
  }
}

/**
 * HTTP progress event base
 */
export class HttpProgressEvent {
  /**
   * Creates a progress event
   * @param {string} type - Event type
   * @param {number} loaded - Bytes loaded
   * @param {number} [total] - Total bytes (if known)
   */
  constructor(type, loaded, total) {
    this.type = type;
    this.loaded = loaded;
    this.total = total;
  }

  /**
   * Calculate progress percentage
   * @returns {number|null} Progress percentage (0-100) or null if total unknown
   */
  get progress() {
    if (this.total) {
      return Math.round((this.loaded / this.total) * 100);
    }
    return null;
  }
}

/**
 * HTTP upload progress event
 */
export class HttpUploadProgressEvent extends HttpProgressEvent {
  /**
   * Creates an upload progress event
   * @param {number} loaded - Bytes uploaded
   * @param {number} [total] - Total bytes to upload
   */
  constructor(loaded, total) {
    super(HttpEventType.UploadProgress, loaded, total);
  }
}

/**
 * HTTP download progress event
 */
export class HttpDownloadProgressEvent extends HttpProgressEvent {
  /**
   * Creates a download progress event
   * @param {number} loaded - Bytes downloaded
   * @param {number} [total] - Total bytes to download
   */
  constructor(loaded, total) {
    super(HttpEventType.DownloadProgress, loaded, total);
  }
}

/**
 * HTTP response header event
 */
export class HttpHeaderResponse {
  /**
   * Creates a response header event
   * @param {number} status - HTTP status code
   * @param {string} statusText - HTTP status text
   * @param {Headers} headers - Response headers
   */
  constructor(status, statusText, headers) {
    this.type = HttpEventType.ResponseHeader;
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.ok = status >= 200 && status < 300;
  }
}

/**
 * HTTP full response event
 */
export class HttpResponse {
  /**
   * Creates a full response event
   * @param {*} body - Response body
   * @param {number} status - HTTP status code
   * @param {string} statusText - HTTP status text
   * @param {Headers} headers - Response headers
   * @param {string} url - Response URL
   */
  constructor(body, status, statusText, headers, url) {
    this.type = HttpEventType.Response;
    this.body = body;
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.url = url;
    this.ok = status >= 200 && status < 300;
  }
}

/**
 * HTTP error response
 */
export class HttpErrorResponse extends Error {
  /**
   * Creates an error response
   * @param {number} status - HTTP status code
   * @param {string} statusText - HTTP status text
   * @param {*} error - Error body
   * @param {Headers} [headers] - Response headers
   * @param {string} [url] - Response URL
   */
  constructor(status, statusText, error, headers, url) {
    super(`HTTP Error: ${status} ${statusText}`);
    this.name = 'HttpErrorResponse';
    this.status = status;
    this.statusText = statusText;
    this.error = error;
    this.headers = headers;
    this.url = url;
    this.ok = false;
  }
}

/**
 * User-defined HTTP event
 */
export class HttpUserEvent {
  /**
   * Creates a user event
   * @param {*} data - User data
   */
  constructor(data) {
    this.type = HttpEventType.User;
    this.data = data;
  }
}

/**
 * Immutable set of HTTP headers
 * Similar to Angular's HttpHeaders
 */
export class HttpHeaders {
  /**
   * Creates an instance of HttpHeaders
   * @param {Object.<string, string|string[]>|Headers|HttpHeaders} [init] - Initial headers
   */
  constructor(init = {}) {
    this._headers = new Map();

    if (init instanceof HttpHeaders) {
      init._headers.forEach((values, key) => {
        this._headers.set(key, [...values]);
      });
    } else if (init instanceof Headers) {
      init.forEach((value, key) => {
        this._headers.set(this._normalizeKey(key), [value]);
      });
    } else if (typeof init === 'object') {
      Object.entries(init).forEach(([key, value]) => {
        const normalizedKey = this._normalizeKey(key);
        if (Array.isArray(value)) {
          this._headers.set(normalizedKey, [...value]);
        } else {
          this._headers.set(normalizedKey, [String(value)]);
        }
      });
    }
  }

  /**
   * Normalize header key to lowercase
   * @private
   * @param {string} key - Header key
   * @returns {string} Normalized key
   */
  _normalizeKey(key) {
    return key.toLowerCase();
  }

  /**
   * Check if a header exists
   * @param {string} name - Header name
   * @returns {boolean} True if header exists
   */
  has(name) {
    return this._headers.has(this._normalizeKey(name));
  }

  /**
   * Get the first value for a header
   * @param {string} name - Header name
   * @returns {string|null} Header value or null
   */
  get(name) {
    const values = this._headers.get(this._normalizeKey(name));
    return values && values.length > 0 ? values[0] : null;
  }

  /**
   * Get all values for a header
   * @param {string} name - Header name
   * @returns {string[]|null} Array of header values or null
   */
  getAll(name) {
    const values = this._headers.get(this._normalizeKey(name));
    return values ? [...values] : null;
  }

  /**
   * Get all header names
   * @returns {string[]} Array of header names
   */
  keys() {
    return Array.from(this._headers.keys());
  }

  /**
   * Append a value to a header
   * @param {string} name - Header name
   * @param {string|string[]} value - Header value(s) to append
   * @returns {HttpHeaders} New HttpHeaders instance
   */
  append(name, value) {
    const newHeaders = new HttpHeaders(this);
    const normalizedKey = this._normalizeKey(name);
    const existing = newHeaders._headers.get(normalizedKey) || [];

    if (Array.isArray(value)) {
      newHeaders._headers.set(normalizedKey, [...existing, ...value]);
    } else {
      newHeaders._headers.set(normalizedKey, [...existing, String(value)]);
    }

    return newHeaders;
  }

  /**
   * Set a header value (replaces existing)
   * @param {string} name - Header name
   * @param {string|string[]} value - Header value(s)
   * @returns {HttpHeaders} New HttpHeaders instance
   */
  set(name, value) {
    const newHeaders = new HttpHeaders(this);
    const normalizedKey = this._normalizeKey(name);

    if (Array.isArray(value)) {
      newHeaders._headers.set(normalizedKey, [...value]);
    } else {
      newHeaders._headers.set(normalizedKey, [String(value)]);
    }

    return newHeaders;
  }

  /**
   * Delete a header
   * @param {string} name - Header name
   * @returns {HttpHeaders} New HttpHeaders instance
   */
  delete(name) {
    const newHeaders = new HttpHeaders(this);
    newHeaders._headers.delete(this._normalizeKey(name));
    return newHeaders;
  }

  /**
   * Convert to plain object
   * @returns {Object.<string, string>} Plain object with single values
   */
  toObject() {
    const obj = {};
    this._headers.forEach((values, key) => {
      obj[key] = values.join(', ');
    });
    return obj;
  }

  /**
   * Convert to Headers object (for Fetch API)
   * @returns {Headers} Headers object
   */
  toHeaders() {
    const headers = new Headers();
    this._headers.forEach((values, key) => {
      values.forEach((value) => {
        headers.append(key, value);
      });
    });
    return headers;
  }

  /**
   * Create HttpHeaders from an object
   * @param {Object.<string, string|string[]>} obj - Object to convert
   * @returns {HttpHeaders} New HttpHeaders instance
   */
  static fromObject(obj) {
    return new HttpHeaders(obj);
  }
}

/**
 * Immutable set of HTTP parameters for building query strings
 * Similar to Angular's HttpParams
 */
export class HttpParams {
  /**
   * Creates an instance of HttpParams
   * @param {Object.<string, string|string[]>|URLSearchParams|string} [options] - Initial parameters
   */
  constructor(options = {}) {
    if (typeof options === 'string') {
      this._params = new URLSearchParams(options);
    } else if (options instanceof URLSearchParams) {
      this._params = new URLSearchParams(options);
    } else if (options instanceof HttpParams) {
      this._params = new URLSearchParams(options._params);
    } else {
      this._params = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => this._params.append(key, String(v)));
        } else {
          this._params.set(key, String(value));
        }
      });
    }
  }

  /**
   * Check if a parameter exists
   * @param {string} param - Parameter name
   * @returns {boolean} True if parameter exists
   */
  has(param) {
    return this._params.has(param);
  }

  /**
   * Get the first value for a parameter
   * @param {string} param - Parameter name
   * @returns {string|null} Parameter value or null
   */
  get(param) {
    return this._params.get(param);
  }

  /**
   * Get all values for a parameter
   * @param {string} param - Parameter name
   * @returns {string[]} Array of parameter values
   */
  getAll(param) {
    return this._params.getAll(param);
  }

  /**
   * Get all parameter names
   * @returns {string[]} Array of parameter names
   */
  keys() {
    return Array.from(this._params.keys());
  }

  /**
   * Append a value to a parameter (allows duplicates)
   * @param {string} param - Parameter name
   * @param {string|number|boolean} value - Parameter value
   * @returns {HttpParams} New HttpParams instance
   */
  append(param, value) {
    const newParams = new HttpParams(this);
    newParams._params.append(param, String(value));
    return newParams;
  }

  /**
   * Append multiple values to a parameter
   * @param {string} param - Parameter name
   * @param {Array<string|number|boolean>} values - Parameter values
   * @returns {HttpParams} New HttpParams instance
   */
  appendAll(param, values) {
    const newParams = new HttpParams(this);
    values.forEach((value) => {
      newParams._params.append(param, String(value));
    });
    return newParams;
  }

  /**
   * Set a parameter value (replaces existing)
   * @param {string} param - Parameter name
   * @param {string|number|boolean} value - Parameter value
   * @returns {HttpParams} New HttpParams instance
   */
  set(param, value) {
    const newParams = new HttpParams(this);
    newParams._params.set(param, String(value));
    return newParams;
  }

  /**
   * Delete a parameter
   * @param {string} param - Parameter name
   * @returns {HttpParams} New HttpParams instance
   */
  delete(param) {
    const newParams = new HttpParams(this);
    newParams._params.delete(param);
    return newParams;
  }

  /**
   * Convert to URL query string
   * @returns {string} Query string (without leading '?')
   */
  toString() {
    return this._params.toString();
  }

  /**
   * Create HttpParams from an object
   * @param {Object.<string, string|string[]|number|boolean>} obj - Object to convert
   * @returns {HttpParams} New HttpParams instance
   */
  static fromObject(obj) {
    return new HttpParams(obj);
  }

  /**
   * Create HttpParams from a query string
   * @param {string} queryString - Query string (with or without leading '?')
   * @returns {HttpParams} New HttpParams instance
   */
  static fromString(queryString) {
    return new HttpParams(queryString.replace(/^\?/, ''));
  }
}
