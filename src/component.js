import { BehaviorSubject, Subject } from '../packages/rxjs/cjs/index.js';

/**
 * Base Component class for reactive components
 * Provides lifecycle hooks, state management, and data binding
 */
export class Component {
  /**
   * Creates a component instance
   * @param {Object} options - Component options
   * @param {string} options.selector - CSS selector for component
   * @param {string} options.template - HTML template
   * @param {Object} options.data - Initial component data
   * @param {Object} options.methods - Component methods
   * @param {Object} options.computed - Computed properties
   * @param {Object} options.services - Injected services
   */
  constructor(options = {}) {
    const {
      selector,
      template = '',
      data = {},
      methods = {},
      computed = {},
      services = {},
    } = options;

    this.selector = selector;
    this.template = template;
    this._services = services;
    this._methods = methods;
    this._computed = computed;

    // State management
    this.state$ = new BehaviorSubject({ ...data });
    this._state = { ...data };

    // Event emitters
    this._events = new Map();

    // Lifecycle state
    this._mounted = false;
    this._destroyed = false;

    // DOM references
    this.el = null;
    this._bindings = [];
    this._subscriptions = [];

    // Change detection
    this._changeDetector = null;

    // Bind methods to component instance
    Object.keys(methods).forEach((key) => {
      this[key] = methods[key].bind(this);
    });

    // Setup computed properties
    this._setupComputed();
  }

  /**
   * Setup computed properties
   */
  _setupComputed() {
    Object.entries(this._computed).forEach(([key, fn]) => {
      Object.defineProperty(this, key, {
        get: () => fn.call(this, this._state),
        enumerable: true,
      });
    });
  }

  /**
   * Get current state
   * @returns {Object} Current state
   */
  get state() {
    return this._state;
  }

  /**
   * Set state and trigger change detection
   * @param {Object|Function} updater - New state or updater function
   */
  setState(updater) {
    if (typeof updater === 'function') {
      this._state = { ...this._state, ...updater(this._state) };
    } else {
      this._state = { ...this._state, ...updater };
    }

    this.state$.next(this._state);
    this._detectChanges();
  }

  /**
   * Update a single state property
   * @param {string} key - Property key
   * @param {*} value - New value
   */
  updateState(key, value) {
    this._state[key] = value;
    this.state$.next(this._state);
    this._detectChanges();
  }

  /**
   * Lifecycle hook: Called before component is mounted
   */
  onInit() {}

  /**
   * Lifecycle hook: Called after component is mounted to DOM
   */
  onMount() {}

  /**
   * Lifecycle hook: Called when component state changes
   */
  onChange() {}

  /**
   * Lifecycle hook: Called before component is destroyed
   */
  onDestroy() {}

  /**
   * Mount component to DOM
   * @param {HTMLElement|string} target - Target element or selector
   */
  mount(target) {
    if (this._mounted) {
      console.warn('Component already mounted');
      return;
    }

    // Get target element
    this.el =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!this.el) {
      throw new Error(`Cannot find element: ${target}`);
    }

    // Call onInit lifecycle
    this.onInit();

    // Render template
    this._render();

    // Setup bindings and directives
    this._setupBindings();

    // Subscribe to state changes
    this._subscriptions.push(
      this.state$.subscribe((state) => {
        this.onChange(state);
        this._detectChanges();
      })
    );

    this._mounted = true;

    // Call onMount lifecycle
    this.onMount();

    return this;
  }

  /**
   * Render template to DOM
   */
  _render() {
    if (!this.el) {
      return;
    }

    // Parse and render template
    const rendered = this._compileTemplate(this.template);
    this.el.innerHTML = rendered;
  }

  /**
   * Compile template with data
   * @param {string} template - Template string
   * @returns {string} Compiled template
   */
  _compileTemplate(template) {
    let compiled = template;

    // Replace interpolations {{ variable }}
    compiled = compiled.replace(/\{\{([^}]+)\}\}/g, (match, expr) => {
      try {
        const value = this._evaluateExpression(expr.trim());
        return value !== undefined && value !== null ? value : '';
      } catch (error) {
        console.warn(`Error evaluating expression: ${expr}`, error);
        return '';
      }
    });

    return compiled;
  }

  /**
   * Evaluate JavaScript expression in component context
   * @param {string} expr - Expression to evaluate
   * @returns {*} Result
   */
  _evaluateExpression(expr) {
    try {
      // Create context object with all accessible properties
      const context = {
        ...this._state,
        ...this._computed,
        ...this._methods,
      };

      // Create function with component context (no 'with' for better performance)
      const keys = Object.keys(context);
      const values = keys.map((key) => context[key]);
      const fn = new Function(...keys, `return ${expr}`);

      return fn(...values);
    } catch (error) {
      console.error(`Expression evaluation error: ${expr}`, error);
      return undefined;
    }
  }

  /**
   * Setup data bindings and event listeners
   */
  _setupBindings() {
    if (!this.el) {
      return;
    }

    // Setup property bindings [property]="value"
    this._setupPropertyBindings();

    // Setup event bindings (click)="method()"
    this._setupEventBindings();

    // Setup two-way bindings [(ngModel)]="property"
    this._setupTwoWayBindings();

    // Setup attribute bindings [attr.name]="value"
    this._setupAttributeBindings();

    // Setup class bindings [class.name]="condition"
    this._setupClassBindings();

    // Setup style bindings [style.property]="value"
    this._setupStyleBindings();
  }

  /**
   * Setup property bindings [property]="value"
   */
  _setupPropertyBindings() {
    const elements = this.el.querySelectorAll('[\\[bind\\]]');
    elements.forEach((element) => {
      const expr = element.getAttribute('[bind]');
      if (expr) {
        const binding = {
          element,
          type: 'property',
          expression: expr,
          update: () => {
            const value = this._evaluateExpression(expr);
            element.textContent = value;
          },
        };
        binding.update();
        this._bindings.push(binding);
      }
    });
  }

  /**
   * Setup event bindings (event)="handler"
   */
  _setupEventBindings() {
    const eventPattern = /\((\w+)\)="([^"]+)"/g;
    const html = this.el.innerHTML;
    let match;

    while ((match = eventPattern.exec(html)) !== null) {
      const [, eventName, handler] = match;
      const elements = this.el.querySelectorAll(`[\\(${eventName}\\)]`);

      elements.forEach((element) => {
        const expr = element.getAttribute(`(${eventName})`);
        if (expr) {
          const listener = (event) => {
            try {
              // Create context with event
              const context = {
                ...this._state,
                ...this._methods,
                event,
                $event: event,
              };
              const keys = Object.keys(context);
              const values = keys.map((key) => context[key]);
              const fn = new Function(...keys, expr);
              fn(...values);
            } catch (error) {
              console.error(`Event handler error: ${expr}`, error);
            }
          };

          element.addEventListener(eventName, listener);
          this._bindings.push({
            element,
            type: 'event',
            eventName,
            listener,
          });
        }
      });
    }
  }

  /**
   * Setup two-way bindings [(ngModel)]="property"
   */
  _setupTwoWayBindings() {
    const elements = this.el.querySelectorAll('[\\[\\(ngModel\\)\\]]');
    elements.forEach((element) => {
      const property = element.getAttribute('[(ngModel)]');
      if (property && property in this._state) {
        // Set initial value
        if (element.type === 'checkbox') {
          element.checked = this._state[property];
        } else {
          element.value = this._state[property];
        }

        // Listen for changes
        const eventName = element.type === 'checkbox' ? 'change' : 'input';
        const listener = (event) => {
          const value =
            element.type === 'checkbox' ? element.checked : element.value;
          this.updateState(property, value);
        };

        element.addEventListener(eventName, listener);
        this._bindings.push({
          element,
          type: 'two-way',
          property,
          listener,
          update: () => {
            if (element.type === 'checkbox') {
              element.checked = this._state[property];
            } else {
              element.value = this._state[property];
            }
          },
        });
      }
    });
  }

  /**
   * Setup attribute bindings [attr.name]="value"
   */
  _setupAttributeBindings() {
    const elements = this.el.querySelectorAll('[class*="[attr."]');
    elements.forEach((element) => {
      const attrs = element.getAttributeNames();
      attrs
        .filter((attr) => attr.startsWith('[attr.'))
        .forEach((attr) => {
          const attrName = attr.match(/\[attr\.(\w+)\]/)?.[1];
          const expr = element.getAttribute(attr);

          if (attrName && expr) {
            const binding = {
              element,
              type: 'attribute',
              attribute: attrName,
              expression: expr,
              update: () => {
                const value = this._evaluateExpression(expr);
                if (value !== null && value !== undefined) {
                  element.setAttribute(attrName, value);
                } else {
                  element.removeAttribute(attrName);
                }
              },
            };
            binding.update();
            this._bindings.push(binding);
          }
        });
    });
  }

  /**
   * Setup class bindings [class.name]="condition"
   */
  _setupClassBindings() {
    const elements = this.el.querySelectorAll('[class*="[class."]');
    elements.forEach((element) => {
      const attrs = element.getAttributeNames();
      attrs
        .filter((attr) => attr.startsWith('[class.'))
        .forEach((attr) => {
          const className = attr.match(/\[class\.(\S+)\]/)?.[1];
          const expr = element.getAttribute(attr);

          if (className && expr) {
            const binding = {
              element,
              type: 'class',
              className,
              expression: expr,
              update: () => {
                const condition = this._evaluateExpression(expr);
                if (condition) {
                  element.classList.add(className);
                } else {
                  element.classList.remove(className);
                }
              },
            };
            binding.update();
            this._bindings.push(binding);
          }
        });
    });
  }

  /**
   * Setup style bindings [style.property]="value"
   */
  _setupStyleBindings() {
    const elements = this.el.querySelectorAll('[class*="[style."]');
    elements.forEach((element) => {
      const attrs = element.getAttributeNames();
      attrs
        .filter((attr) => attr.startsWith('[style.'))
        .forEach((attr) => {
          const styleProp = attr.match(/\[style\.(\S+)\]/)?.[1];
          const expr = element.getAttribute(attr);

          if (styleProp && expr) {
            const binding = {
              element,
              type: 'style',
              property: styleProp,
              expression: expr,
              update: () => {
                const value = this._evaluateExpression(expr);
                if (value !== null && value !== undefined) {
                  element.style[styleProp] = value;
                } else {
                  element.style[styleProp] = '';
                }
              },
            };
            binding.update();
            this._bindings.push(binding);
          }
        });
    });
  }

  /**
   * Detect changes and update bindings
   */
  _detectChanges() {
    if (!this._mounted || this._destroyed) {
      return;
    }

    // Update all bindings
    this._bindings.forEach((binding) => {
      if (binding.update) {
        binding.update();
      }
    });

    // Re-render interpolations
    this._updateInterpolations();
  }

  /**
   * Update text interpolations
   */
  _updateInterpolations() {
    if (!this.el) {
      return;
    }

    const walker = document.createTreeWalker(
      this.el,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.includes('{{')) {
        textNodes.push(node);
      }
    }

    textNodes.forEach((node) => {
      if (!node._originalText) {
        node._originalText = node.nodeValue;
      }

      const compiled = this._compileTemplate(node._originalText);
      if (node.nodeValue !== compiled) {
        node.nodeValue = compiled;
      }
    });
  }

  /**
   * Emit custom event
   * @param {string} eventName - Event name
   * @param {*} data - Event data
   */
  emit(eventName, data) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Subject());
    }
    this._events.get(eventName).next(data);
  }

  /**
   * Listen to custom event
   * @param {string} eventName - Event name
   * @param {Function} handler - Event handler
   * @returns {Object} Subscription
   */
  on(eventName, handler) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Subject());
    }
    return this._events.get(eventName).subscribe(handler);
  }

  /**
   * Destroy component and cleanup
   */
  destroy() {
    if (this._destroyed) {
      return;
    }

    // Call onDestroy lifecycle
    this.onDestroy();

    // Cleanup bindings
    this._bindings.forEach((binding) => {
      if (binding.type === 'event' || binding.type === 'two-way') {
        binding.element.removeEventListener(
          binding.eventName || 'input',
          binding.listener
        );
      }
    });
    this._bindings = [];

    // Cleanup subscriptions
    this._subscriptions.forEach((sub) => sub.unsubscribe());
    this._subscriptions = [];

    // Cleanup event emitters
    this._events.forEach((subject) => subject.complete());
    this._events.clear();

    // Clear DOM
    if (this.el) {
      this.el.innerHTML = '';
    }

    this._destroyed = true;
    this._mounted = false;
  }
}
