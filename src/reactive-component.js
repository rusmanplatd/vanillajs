import { Component } from './component.js';
import { DirectiveManager } from './directives.js';
import { rootInjector } from './injector.js';

/**
 * Enhanced Reactive Component with directives and DI
 * Extends base Component class
 */
export class ReactiveComponent extends Component {
  /**
   * Creates a reactive component
   * @param {Object} options - Component options
   */
  constructor(options = {}) {
    super(options);

    // Directive manager
    this._directiveManager = null;

    // Injector (child of root)
    this._injector = options.injector || rootInjector.createChild();

    // Inject services
    if (this._services && typeof this._services === 'object') {
      Object.entries(this._services).forEach(([key, ServiceClass]) => {
        this[key] = this._injector.get(ServiceClass);
      });
    }
  }

  /**
   * Mount component with directive processing
   * @param {HTMLElement|string} target - Target element
   */
  mount(target) {
    // Call parent mount
    super.mount(target);

    // Process directives after initial render
    this._setupDirectives();

    return this;
  }

  /**
   * Setup directive manager
   */
  _setupDirectives() {
    if (!this.el) {
      return;
    }

    // Create directive manager
    this._directiveManager = new DirectiveManager(
      this.el,
      this._evaluateExpression.bind(this)
    );

    // Process directives
    this._directiveManager.process();
  }

  /**
   * Enhanced render with directive support
   */
  _render() {
    if (!this.el) {
      return;
    }

    // Store scroll position
    const scrollTop = this.el.scrollTop;

    // Render template
    super._render();

    // Process directives
    if (this._directiveManager) {
      this._directiveManager.destroy();
    }
    this._setupDirectives();

    // Restore scroll position
    this.el.scrollTop = scrollTop;
  }

  /**
   * Enhanced change detection with directives
   */
  _detectChanges() {
    if (!this._mounted || this._destroyed) {
      return;
    }

    // Update component bindings
    super._detectChanges();

    // Update directives
    if (this._directiveManager) {
      this._directiveManager.update();
    }
  }

  /**
   * Destroy component and directives
   */
  destroy() {
    // Destroy directives
    if (this._directiveManager) {
      this._directiveManager.destroy();
      this._directiveManager = null;
    }

    // Call parent destroy
    super.destroy();
  }
}

/**
 * Component decorator for class-based components
 * @param {Object} config - Component configuration
 * @returns {Function} Class decorator
 */
export function ComponentDecorator(config) {
  return function (target) {
    // Store config on class
    target._componentConfig = config;

    // Return enhanced class
    return class extends ReactiveComponent {
      constructor() {
        super({
          ...config,
          data: config.data || {},
          methods: target.prototype,
          computed: config.computed || {},
        });

        // Copy instance methods
        const proto = target.prototype;
        Object.getOwnPropertyNames(proto).forEach((key) => {
          if (key !== 'constructor' && typeof proto[key] === 'function') {
            this[key] = proto[key].bind(this);
          }
        });

        // Call original constructor
        if (target.prototype.constructor !== Object) {
          target.call(this);
        }
      }
    };
  };
}
