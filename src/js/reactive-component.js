/**
 * Angular-style Web Component System with Light DOM
 * Pure Angular architecture for vanilla JavaScript
 */

// Metadata storage for decorators
const INPUT_METADATA = new WeakMap();
const OUTPUT_METADATA = new WeakMap();
const VIEWCHILD_METADATA = new WeakMap();

/**
 * Dependency Injection Container (like Angular's Injector)
 */
class InjectorContainer {
  constructor() {
    this.providers = new Map();
  }

  /**
   * Provide a service
   * @param {Function} token - Service class
   * @param {*} value - Service instance or factory
   */
  provide(token, value) {
    this.providers.set(token, value);
  }

  /**
   * Get a service from the injector
   * @param {Function} token - Service class
   * @returns {*} Service instance
   */
  get(token) {
    if (this.providers.has(token)) {
      const provider = this.providers.get(token);
      return typeof provider === 'function' ? provider() : provider;
    }

    // Auto-instantiate if it's a class
    if (typeof token === 'function') {
      const instance = new token();
      this.providers.set(token, instance);
      return instance;
    }

    throw new Error(`No provider for ${token.name || token}`);
  }
}

// Global injector instance
export const Injector = new InjectorContainer();

/**
 * Injectable decorator - marks a class as injectable (like Angular @Injectable)
 * @returns {Function} Class decorator
 */
export function Injectable() {
  return function (ServiceClass) {
    // Auto-register the service
    if (!Injector.providers.has(ServiceClass)) {
      Injector.provide(ServiceClass, new ServiceClass());
    }
    return ServiceClass;
  };
}

/**
 * Input decorator - marks a property as a component input (like Angular @Input)
 * @param {string} [attributeName] - Optional attribute name (defaults to property name)
 * @returns {Function} Property decorator
 */
export function Input(attributeName) {
  return function (target, propertyKey) {
    const attrName = attributeName || propertyKey.toLowerCase();

    if (!target.constructor._inputs) {
      target.constructor._inputs = {};
    }
    target.constructor._inputs[attrName] = propertyKey;
  };
}

/**
 * Output decorator - marks a property as an event emitter (like Angular @Output)
 * @returns {Function} Property decorator
 */
export function Output() {
  return function (target, propertyKey) {
    if (!target.constructor._outputs) {
      target.constructor._outputs = [];
    }
    target.constructor._outputs.push(propertyKey);
  };
}

/**
 * ViewChild decorator - queries a child element (like Angular @ViewChild)
 * @param {string} selector - CSS selector or template reference
 * @returns {Function} Property decorator
 */
export function ViewChild(selector) {
  return function (target, propertyKey) {
    if (!target.constructor._viewChildren) {
      target.constructor._viewChildren = {};
    }
    target.constructor._viewChildren[propertyKey] = selector;
  };
}

/**
 * HostListener decorator - listens to host element events (like Angular @HostListener)
 * @param {string} eventName - Event name
 * @param {Array<string>} [args] - Event arguments
 * @returns {Function} Method decorator
 */
export function HostListener(eventName, args = []) {
  return function (target, propertyKey, descriptor) {
    if (!target.constructor._hostListeners) {
      target.constructor._hostListeners = [];
    }
    target.constructor._hostListeners.push({
      eventName,
      methodName: propertyKey,
      args,
    });
    return descriptor;
  };
}

/**
 * EventEmitter class for Angular-style output events
 */
export class EventEmitter {
  constructor(component, eventName) {
    this._component = component;
    this._eventName = eventName;
  }

  emit(value) {
    if (this._component) {
      this._component.dispatchEvent(
        new CustomEvent(this._eventName, {
          detail: value,
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  subscribe(callback) {
    if (this._component) {
      this._component.addEventListener(this._eventName, (e) => callback(e.detail));
    }
    return {
      unsubscribe: () => {},
    };
  }
}

/**
 * Change Detection Strategies (like Angular)
 */
export const ChangeDetectionStrategy = {
  Default: 'Default',
  OnPush: 'OnPush',
};

/**
 * Pipe registry for Angular-style pipes
 */
const PIPE_REGISTRY = new Map();

/**
 * Register a pipe for use in templates
 * @param {string} name - Pipe name
 * @param {Function} transform - Transform function
 */
export function registerPipe(name, transform) {
  PIPE_REGISTRY.set(name, transform);
}

/**
 * Pipe decorator - marks a class as a pipe (like Angular @Pipe)
 * @param {Object} config - Pipe configuration
 * @param {string} config.name - Pipe name
 * @returns {Function} Class decorator
 */
export function Pipe(config) {
  return function (PipeClass) {
    const pipe = new PipeClass();
    PIPE_REGISTRY.set(config.name, pipe.transform.bind(pipe));
    return PipeClass;
  };
}

// Built-in Angular pipes
registerPipe('uppercase', (value) => String(value).toUpperCase());
registerPipe('lowercase', (value) => String(value).toLowerCase());
registerPipe('titlecase', (value) =>
  String(value).replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
);
registerPipe('json', (value) => JSON.stringify(value, null, 2));
registerPipe('date', (value, format = 'short') => {
  const date = new Date(value);
  if (format === 'short') return date.toLocaleDateString();
  if (format === 'long') return date.toLocaleDateString(undefined, { dateStyle: 'long' });
  if (format === 'full') return date.toLocaleDateString(undefined, { dateStyle: 'full' });
  return date.toISOString();
});
registerPipe('currency', (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
});
registerPipe('percent', (value) => `${(value * 100).toFixed(2)}%`);
registerPipe('number', (value, digits = '1.0-3') => {
  const [min, max] = digits.split('-').map(Number);
  return Number(value).toFixed(max || min);
});

/**
 * Base class for Angular-style reactive web components
 * @class ReactiveComponent
 * @extends HTMLElement
 */
export class ReactiveComponent extends HTMLElement {
  constructor() {
    super();

    this._isConnected = false;
    this._templateUrl = null;
    this._styleUrl = null;
    this._externalTemplate = null;
    this._externalStyles = null;
    this._viewChildren = {};
    this._eventListeners = new Map();
    this._styleElement = null;
    this.changeDetectionStrategy = ChangeDetectionStrategy.Default;

    // Initialize @Input properties
    this._initializeInputs();

    // Initialize @Output properties
    this._initializeOutputs();

    // Initialize @HostListener
    this._initializeHostListeners();
  }

  /**
   * Initialize @Input decorated properties
   * @private
   */
  _initializeInputs() {
    const inputs = this.constructor._inputs || {};
    Object.keys(inputs).forEach((attrName) => {
      const propName = inputs[attrName];

      Object.defineProperty(this, `_${propName}`, {
        writable: true,
        value: this[propName],
      });

      Object.defineProperty(this, propName, {
        get() {
          return this[`_${propName}`];
        },
        set(value) {
          const oldValue = this[`_${propName}`];
          this[`_${propName}`] = value;

          if (typeof this.ngOnChanges === 'function' && oldValue !== value) {
            this.ngOnChanges({
              [propName]: {
                currentValue: value,
                previousValue: oldValue,
                firstChange: oldValue === undefined,
              },
            });
          }

          this.detectChanges();
        },
        enumerable: true,
        configurable: true,
      });
    });
  }

  /**
   * Initialize @Output decorated properties
   * @private
   */
  _initializeOutputs() {
    const outputs = this.constructor._outputs || [];
    outputs.forEach((propName) => {
      this[propName] = new EventEmitter(this, propName);
    });
  }

  /**
   * Initialize @HostListener bindings
   * @private
   */
  _initializeHostListeners() {
    const listeners = this.constructor._hostListeners || [];
    listeners.forEach(({ eventName, methodName }) => {
      this.addEventListener(eventName, (e) => {
        if (typeof this[methodName] === 'function') {
          this[methodName](e);
        }
      });
    });
  }

  /**
   * Get observed attributes from @Input decorators
   */
  static get observedAttributes() {
    return Object.keys(this._inputs || {});
  }

  /**
   * Angular lifecycle: Component initialization
   */
  async connectedCallback() {
    this._isConnected = true;

    // Load external resources
    await this._loadExternalResources();

    // Call Angular lifecycle hooks
    if (typeof this.ngOnInit === 'function') {
      this.ngOnInit();
    }

    // Initial render
    await this.detectChanges();

    // After view init
    this._queryViewChildren();
    if (typeof this.ngAfterViewInit === 'function') {
      this.ngAfterViewInit();
    }
  }

  /**
   * Angular lifecycle: Component destruction
   */
  disconnectedCallback() {
    this._isConnected = false;

    if (typeof this.ngOnDestroy === 'function') {
      this.ngOnDestroy();
    }

    this._cleanup();
  }

  /**
   * Angular lifecycle: Attribute changes
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    const inputs = this.constructor._inputs || {};
    const propName = inputs[name];

    if (propName && this.hasOwnProperty(propName)) {
      // Convert attribute value to appropriate type
      this[propName] = this._parseAttributeValue(newValue);
    }
  }

  /**
   * Parse attribute value to proper type
   * @private
   */
  _parseAttributeValue(value) {
    if (value === null || value === undefined) return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (value === 'undefined') return undefined;
    if (!isNaN(value) && value !== '') return Number(value);

    // Try to parse JSON
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  /**
   * Load external HTML and CSS resources
   * @private
   */
  async _loadExternalResources() {
    const promises = [];

    if (this._templateUrl) {
      promises.push(
        fetch(this._templateUrl)
          .then((response) => response.text())
          .then((html) => {
            this._externalTemplate = html;
          })
          .catch((error) => {
            console.error(`Failed to load template from ${this._templateUrl}:`, error);
          })
      );
    }

    if (this._styleUrl) {
      promises.push(
        fetch(this._styleUrl)
          .then((response) => response.text())
          .then((css) => {
            this._externalStyles = css;
          })
          .catch((error) => {
            console.error(`Failed to load styles from ${this._styleUrl}:`, error);
          })
      );
    }

    await Promise.all(promises);
  }

  /**
   * Get component template (override in subclass or set via @Component decorator)
   * @returns {string} HTML template
   */
  template() {
    return this._externalTemplate || '';
  }

  /**
   * Get component styles (override in subclass or set via @Component decorator)
   * @returns {string} CSS styles
   */
  styles() {
    return this._externalStyles || '';
  }

  /**
   * Angular change detection - triggers re-render
   */
  async detectChanges() {
    if (!this._isConnected) return;

    let templateHTML = this.template();
    const stylesCSS = this.styles();

    // Process template interpolation {{}}
    templateHTML = this._processInterpolation(templateHTML);

    // Process structural directives (*ngIf, *ngFor)
    templateHTML = this._processStructuralDirectives(templateHTML);

    // Inject styles only once
    if (stylesCSS && !this._styleElement) {
      this._styleElement = document.createElement('style');
      this._styleElement.textContent = stylesCSS;
      this.appendChild(this._styleElement);
    }

    // Build Light DOM content
    this.innerHTML = (this._styleElement ? '' : '') + templateHTML;
    if (this._styleElement && !this.contains(this._styleElement)) {
      this.insertBefore(this._styleElement, this.firstChild);
    }

    // Bind event listeners (click)="method()"
    this._bindEventListeners();

    // Property binding [property]="value"
    this._bindProperties();

    // Two-way data binding [(ngModel)]="property"
    this._bindTwoWayDataBinding();

    // Attribute directives [ngClass], [ngStyle]
    this._bindAttributeDirectives();

    // Query ViewChildren
    this._queryViewChildren();

    // Call Angular lifecycle hook
    if (typeof this.ngAfterViewChecked === 'function') {
      this.ngAfterViewChecked();
    }
  }

  /**
   * Process template interpolation {{expression}} with pipe support
   * @private
   */
  _processInterpolation(template) {
    return template.replace(/\{\{(.+?)\}\}/g, (match, expression) => {
      try {
        expression = expression.trim();

        // Check for pipes: {{ value | pipeName:arg1:arg2 }}
        const pipeMatch = expression.match(/^(.+?)\s*\|\s*(.+)$/);

        if (pipeMatch) {
          const [, valueExpr, pipeChain] = pipeMatch;

          // Evaluate the value expression
          const func = new Function('component', `with(component) { return ${valueExpr.trim()}; }`);
          let value = func(this);

          // Process pipe chain (can have multiple pipes)
          const pipes = pipeChain.split('|').map((p) => p.trim());

          pipes.forEach((pipeExpr) => {
            const [pipeName, ...args] = pipeExpr.split(':').map((s) => s.trim());
            const pipeFunc = PIPE_REGISTRY.get(pipeName);

            if (pipeFunc) {
              // Evaluate pipe arguments
              const evaluatedArgs = args.map((arg) => {
                try {
                  const argFunc = new Function('component', `with(component) { return ${arg}; }`);
                  return argFunc(this);
                } catch {
                  return arg.replace(/['"]/g, ''); // String literal
                }
              });

              value = pipeFunc(value, ...evaluatedArgs);
            } else {
              console.warn(`Pipe '${pipeName}' not found`);
            }
          });

          return value ?? '';
        } else {
          // No pipes, just evaluate the expression
          const func = new Function('component', `with(component) { return ${expression}; }`);
          return func(this) ?? '';
        }
      } catch (e) {
        console.error(`Error evaluating {{${expression}}}:`, e);
        return '';
      }
    });
  }

  /**
   * Process structural directives (*ngIf, *ngFor)
   * @private
   */
  _processStructuralDirectives(template) {
    // Process *ngIf
    template = template.replace(
      /<(\w+)([^>]*)\*ngIf="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g,
      (match, tag, beforeAttrs, condition, afterAttrs, content) => {
        try {
          const func = new Function('component', `with(component) { return ${condition}; }`);
          const result = func(this);
          return result ? `<${tag}${beforeAttrs}${afterAttrs}>${content}</${tag}>` : '';
        } catch (e) {
          console.error(`Error evaluating *ngIf="${condition}":`, e);
          return '';
        }
      }
    );

    // Process *ngFor
    template = template.replace(
      /<(\w+)([^>]*)\*ngFor="let (\w+) of ([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g,
      (match, tag, beforeAttrs, itemName, collection, afterAttrs, content) => {
        try {
          const func = new Function('component', `with(component) { return ${collection}; }`);
          const items = func(this);

          if (!Array.isArray(items)) return '';

          return items
            .map((item, index) => {
              let itemContent = content;
              // Replace item references
              itemContent = itemContent.replace(
                new RegExp(`\\{\\{\\s*${itemName}(\\.[^}]+)?\\s*\\}\\}`, 'g'),
                (m, prop) => {
                  return prop ? item[prop.substring(1)] ?? '' : item;
                }
              );
              // Replace index references
              itemContent = itemContent.replace(/\{\{\s*i\s*\}\}/g, index);
              return `<${tag}${beforeAttrs}${afterAttrs}>${itemContent}</${tag}>`;
            })
            .join('');
        } catch (e) {
          console.error(`Error evaluating *ngFor="${itemName} of ${collection}":`, e);
          return '';
        }
      }
    );

    return template;
  }

  /**
   * Bind Angular-style event listeners (click)="method()"
   * @private
   */
  _bindEventListeners() {
    this._cleanup();

    const eventPattern = /\((\w+)\)="([^"]+)"/g;
    const template = this.template();
    const matches = [...template.matchAll(eventPattern)];

    const eventMap = new Map();
    matches.forEach(([, eventName, expression]) => {
      if (!eventMap.has(eventName)) {
        eventMap.set(eventName, []);
      }
      eventMap.get(eventName).push(expression);
    });

    eventMap.forEach((expressions, eventName) => {
      expressions.forEach((expression) => {
        const selector = `[\\(${eventName}\\)="${expression}"]`;
        const elements = this.querySelectorAll(selector);

        elements.forEach((element) => {
          const handler = (e) => {
            try {
              // Parse method call
              const methodMatch = expression.match(/^(\w+)\((.*)\)$/);
              if (methodMatch) {
                const [, methodName, argsStr] = methodMatch;
                if (typeof this[methodName] === 'function') {
                  // Evaluate arguments
                  const args = argsStr ? argsStr.split(',').map((arg) => {
                    arg = arg.trim();
                    if (arg === '$event') return e;
                    const func = new Function('component', 'event', `with(component) { return ${arg}; }`);
                    return func(this, e);
                  }) : [];
                  this[methodName](...args);
                }
              }
            } catch (error) {
              console.error(`Error executing (${eventName})="${expression}":`, error);
            }
          };

          element.addEventListener(eventName, handler);

          if (!this._eventListeners.has(element)) {
            this._eventListeners.set(element, []);
          }
          this._eventListeners.get(element).push({ eventName, handler });
        });
      });
    });
  }

  /**
   * Bind property bindings [property]="value"
   * @private
   */
  _bindProperties() {
    const propertyPattern = /\[(\w+)\]="([^"]+)"/g;
    const template = this.template();
    const matches = [...template.matchAll(propertyPattern)];

    matches.forEach(([, propName, expression]) => {
      const selector = `[\\[${propName}\\]="${expression}"]`;
      const elements = this.querySelectorAll(selector);

      elements.forEach((element) => {
        try {
          const func = new Function('component', `with(component) { return ${expression}; }`);
          const value = func(this);
          element[propName] = value;
        } catch (e) {
          console.error(`Error binding [${propName}]="${expression}":`, e);
        }
      });
    });
  }

  /**
   * Bind two-way data binding [(ngModel)]="property"
   * @private
   */
  _bindTwoWayDataBinding() {
    const ngModelPattern = /\[\(ngModel\)\]="([^"]+)"/g;
    const template = this.template();
    const matches = [...template.matchAll(ngModelPattern)];

    matches.forEach(([, propertyPath]) => {
      const selector = `[\\[\\(ngModel\\)\\]="${propertyPath}"]`;
      const elements = this.querySelectorAll(selector);

      elements.forEach((element) => {
        try {
          // Set initial value from component property
          const func = new Function('component', `with(component) { return ${propertyPath}; }`);
          const value = func(this);

          if (element.type === 'checkbox') {
            element.checked = value;
          } else {
            element.value = value ?? '';
          }

          // Listen for changes and update component property
          const eventName = element.type === 'checkbox' ? 'change' : 'input';
          const handler = (e) => {
            const newValue = element.type === 'checkbox' ? element.checked : element.value;

            // Update component property
            const parts = propertyPath.split('.');
            let obj = this;
            for (let i = 0; i < parts.length - 1; i++) {
              obj = obj[parts[i]];
            }
            obj[parts[parts.length - 1]] = newValue;

            this.detectChanges();
          };

          element.addEventListener(eventName, handler);

          if (!this._eventListeners.has(element)) {
            this._eventListeners.set(element, []);
          }
          this._eventListeners.get(element).push({ eventName, handler });
        } catch (e) {
          console.error(`Error binding [(ngModel)]="${propertyPath}":`, e);
        }
      });
    });
  }

  /**
   * Bind attribute directives [ngClass] and [ngStyle]
   * @private
   */
  _bindAttributeDirectives() {
    // Bind [ngClass]
    const ngClassPattern = /\[ngClass\]="([^"]+)"/g;
    const template = this.template();
    let matches = [...template.matchAll(ngClassPattern)];

    matches.forEach(([, expression]) => {
      const selector = `[\\[ngClass\\]="${expression}"]`;
      const elements = this.querySelectorAll(selector);

      elements.forEach((element) => {
        try {
          const func = new Function('component', `with(component) { return ${expression}; }`);
          const value = func(this);

          // Clear existing classes added by ngClass
          if (element._ngClasses) {
            element._ngClasses.forEach((cls) => element.classList.remove(cls));
          }
          element._ngClasses = [];

          // Add new classes
          if (typeof value === 'string') {
            value.split(' ').forEach((cls) => {
              element.classList.add(cls);
              element._ngClasses.push(cls);
            });
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            Object.keys(value).forEach((cls) => {
              if (value[cls]) {
                element.classList.add(cls);
                element._ngClasses.push(cls);
              }
            });
          } else if (Array.isArray(value)) {
            value.forEach((cls) => {
              element.classList.add(cls);
              element._ngClasses.push(cls);
            });
          }
        } catch (e) {
          console.error(`Error binding [ngClass]="${expression}":`, e);
        }
      });
    });

    // Bind [ngStyle]
    const ngStylePattern = /\[ngStyle\]="([^"]+)"/g;
    matches = [...template.matchAll(ngStylePattern)];

    matches.forEach(([, expression]) => {
      const selector = `[\\[ngStyle\\]="${expression}"]`;
      const elements = this.querySelectorAll(selector);

      elements.forEach((element) => {
        try {
          const func = new Function('component', `with(component) { return ${expression}; }`);
          const styles = func(this);

          if (typeof styles === 'object' && !Array.isArray(styles)) {
            Object.keys(styles).forEach((property) => {
              element.style[property] = styles[property];
            });
          }
        } catch (e) {
          console.error(`Error binding [ngStyle]="${expression}":`, e);
        }
      });
    });
  }

  /**
   * Query and populate @ViewChild properties
   * @private
   */
  _queryViewChildren() {
    const viewChildren = this.constructor._viewChildren || {};
    Object.keys(viewChildren).forEach((propName) => {
      const selector = viewChildren[propName];
      this[propName] = this.querySelector(selector);
    });
  }

  /**
   * Clean up event listeners
   * @private
   */
  _cleanup() {
    this._eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ eventName, handler }) => {
        element.removeEventListener(eventName, handler);
      });
    });
    this._eventListeners.clear();
  }
}

/**
 * Component decorator - defines an Angular-style component
 * @param {Object} config - Component configuration
 * @param {string} config.selector - Custom element tag name
 * @param {string} [config.templateUrl] - Path to external HTML template
 * @param {string} [config.styleUrl] - Path to external CSS file
 * @param {string} [config.template] - Inline HTML template
 * @param {string} [config.styles] - Inline CSS styles
 * @param {string} [config.changeDetection] - Change detection strategy
 * @returns {Function} Class decorator function
 */
export function Component(config) {
  return function (ComponentClass) {
    if (!config.selector || !config.selector.includes('-')) {
      throw new Error('Component selector must contain a hyphen (-)');
    }

    class DecoratedComponent extends ComponentClass {
      constructor() {
        super();

        if (config.templateUrl) {
          this._templateUrl = config.templateUrl;
        }
        if (config.styleUrl) {
          this._styleUrl = config.styleUrl;
        }
        if (config.changeDetection) {
          this.changeDetectionStrategy = config.changeDetection;
        }
      }

      template() {
        if (config.template) {
          return config.template;
        }
        return super.template();
      }

      styles() {
        if (config.styles) {
          return config.styles;
        }
        return super.styles();
      }
    }

    if (!customElements.get(config.selector)) {
      customElements.define(config.selector, DecoratedComponent);
    }

    return DecoratedComponent;
  };
}
