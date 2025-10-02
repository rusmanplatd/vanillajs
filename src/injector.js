/**
 * Dependency Injection system
 * Similar to Angular's DI system
 */

/**
 * Injectable decorator/marker
 * @param {Object} options - Injectable options
 * @returns {Function} Class decorator
 */
export function Injectable(options = {}) {
  return function (target) {
    target._injectable = true;
    target._providedIn = options.providedIn || 'root';
    return target;
  };
}

/**
 * Dependency Injector
 * Manages service instances and dependencies
 */
export class Injector {
  /**
   * Creates an injector instance
   * @param {Array<Object>} providers - Array of providers
   * @param {Injector} parent - Parent injector
   */
  constructor(providers = [], parent = null) {
    this.providers = new Map();
    this.instances = new Map();
    this.parent = parent;

    // Register providers
    providers.forEach((provider) => this.register(provider));
  }

  /**
   * Register a provider
   * @param {Object|Function} provider - Provider configuration or class
   */
  register(provider) {
    if (typeof provider === 'function') {
      // Class provider
      this.providers.set(provider, {
        provide: provider,
        useClass: provider,
      });
    } else if (provider.provide) {
      // Object provider
      this.providers.set(provider.provide, provider);
    } else {
      console.warn('Invalid provider:', provider);
    }
  }

  /**
   * Get or create service instance
   * @param {Function|string} token - Service token/class
   * @returns {*} Service instance
   */
  get(token) {
    // Check if instance already exists
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    // Check if provider exists
    if (this.providers.has(token)) {
      const provider = this.providers.get(token);
      const instance = this._createInstance(provider);
      this.instances.set(token, instance);
      return instance;
    }

    // Try parent injector
    if (this.parent) {
      return this.parent.get(token);
    }

    throw new Error(`No provider found for ${token}`);
  }

  /**
   * Create instance from provider
   * @param {Object} provider - Provider configuration
   * @returns {*} Instance
   */
  _createInstance(provider) {
    if (provider.useValue !== undefined) {
      // Value provider
      return provider.useValue;
    }

    if (provider.useFactory) {
      // Factory provider
      const deps = provider.deps || [];
      const resolvedDeps = deps.map((dep) => this.get(dep));
      return provider.useFactory(...resolvedDeps);
    }

    if (provider.useExisting) {
      // Alias provider
      return this.get(provider.useExisting);
    }

    if (provider.useClass) {
      // Class provider
      const ClassConstructor = provider.useClass;
      const deps = this._getDependencies(ClassConstructor);
      const resolvedDeps = deps.map((dep) => this.get(dep));
      return new ClassConstructor(...resolvedDeps);
    }

    throw new Error('Invalid provider configuration');
  }

  /**
   * Get dependencies for a class
   * @param {Function} constructor - Class constructor
   * @returns {Array} Array of dependencies
   */
  _getDependencies(constructor) {
    // Check for explicit dependencies
    if (constructor.inject) {
      return constructor.inject;
    }

    // Try to parse from constructor if available
    if (constructor._dependencies) {
      return constructor._dependencies;
    }

    return [];
  }

  /**
   * Check if a token has a provider
   * @param {Function|string} token - Service token
   * @returns {boolean} True if provider exists
   */
  has(token) {
    return (
      this.instances.has(token) ||
      this.providers.has(token) ||
      (this.parent && this.parent.has(token))
    );
  }

  /**
   * Create a child injector
   * @param {Array} providers - Child providers
   * @returns {Injector} Child injector
   */
  createChild(providers = []) {
    return new Injector(providers, this);
  }

  /**
   * Clear all instances (useful for testing)
   */
  clear() {
    this.instances.clear();
  }
}

/**
 * Root injector singleton
 */
export const rootInjector = new Injector();

/**
 * Helper to define service dependencies
 * @param {Array} deps - Array of dependency tokens
 * @returns {Function} Decorator
 */
export function Inject(...deps) {
  return function (target) {
    target.inject = deps;
    return target;
  };
}

/**
 * Service decorator (combines Injectable and registers in root)
 * @param {Object} options - Service options
 * @returns {Function} Decorator
 */
export function Service(options = {}) {
  return function (target) {
    Injectable(options)(target);

    // Auto-register in root injector
    if (options.providedIn === 'root' || !options.providedIn) {
      rootInjector.register(target);
    }

    return target;
  };
}
