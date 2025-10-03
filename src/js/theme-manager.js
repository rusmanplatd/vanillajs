import { BehaviorSubject } from '../../packages/rxjs/esm/index.js';

/**
 * Theme configuration object
 * @typedef {object} ThemeConfig
 * @property {string} name - Theme name (light, dark, high-contrast, custom)
 * @property {string} [density] - Density mode (default, compact, comfortable)
 * @property {Record<string, string>} [tokens] - Custom CSS token overrides
 */

/**
 * Design system configuration
 * @typedef {object} DesignSystemConfig
 * @property {string} theme - Current theme name
 * @property {string} density - Current density mode
 * @property {boolean} reducedMotion - Prefers reduced motion
 * @property {boolean} darkMode - Dark mode enabled
 * @property {number} scale - UI scale factor
 */

/**
 * ThemeManager - Reactive design system manager
 * Manages theme switching, density, and design tokens with RxJS observables
 * @example
 * const themeManager = new ThemeManager();
 *
 * // Subscribe to theme changes
 * themeManager.theme$.subscribe(theme => {
 *   console.log('Theme changed to:', theme);
 * });
 *
 * // Change theme
 * themeManager.setTheme('dark');
 */
export class ThemeManager {
  /**
   * Creates a new ThemeManager instance
   * @param {object} [options] - Configuration options
   * @param {string} [options.defaultTheme] - Default theme
   * @param {string} [options.defaultDensity] - Default density
   * @param {boolean} [options.persistToLocalStorage] - Save preferences to localStorage
   * @param {string} [options.storageKey] - localStorage key
   */
  constructor(options = {}) {
    this.options = {
      defaultTheme: 'light',
      defaultDensity: 'default',
      persistToLocalStorage: true,
      storageKey: 'design-system-config',
      ...options,
    };

    // Load saved config or use defaults
    const savedConfig = this._loadConfig();

    /**
     * Current theme observable
     * @type {BehaviorSubject<string>}
     */
    this.theme$ = new BehaviorSubject(
      savedConfig.theme || this.options.defaultTheme
    );

    /**
     * Current density observable
     * @type {BehaviorSubject<string>}
     */
    this.density$ = new BehaviorSubject(
      savedConfig.density || this.options.defaultDensity
    );

    /**
     * Reduced motion preference observable
     * @type {BehaviorSubject<boolean>}
     */
    this.reducedMotion$ = new BehaviorSubject(this._prefersReducedMotion());

    /**
     * Dark mode preference observable
     * @type {BehaviorSubject<boolean>}
     */
    this.darkMode$ = new BehaviorSubject(this._prefersDarkMode());

    /**
     * UI scale factor observable
     * @type {BehaviorSubject<number>}
     */
    this.scale$ = new BehaviorSubject(savedConfig.scale || 1);

    /**
     * Combined configuration observable
     * @type {BehaviorSubject<DesignSystemConfig>}
     */
    this.config$ = new BehaviorSubject(this._buildConfig());

    /**
     * Custom tokens map
     * @private
     * @type {Map<string, string>}
     */
    this._customTokens = new Map(Object.entries(savedConfig.tokens || {}));

    // Initialize
    this._applyTheme();
    this._setupMediaQueryListeners();
    this._subscribeToChanges();
  }

  /**
   * Set the current theme
   * @param {string} themeName - Theme name (light, dark, high-contrast, etc.)
   * @example
   * themeManager.setTheme('dark');
   */
  setTheme(themeName) {
    this.theme$.next(themeName);
  }

  /**
   * Set the current density
   * @param {string} density - Density mode (default, compact, comfortable)
   * @example
   * themeManager.setDensity('compact');
   */
  setDensity(density) {
    this.density$.next(density);
  }

  /**
   * Set UI scale factor
   * @param {number} scale - Scale factor (0.5 to 2.0)
   * @example
   * themeManager.setScale(1.2);
   */
  setScale(scale) {
    const clampedScale = Math.max(0.5, Math.min(2.0, scale));
    this.scale$.next(clampedScale);
  }

  /**
   * Toggle between light and dark theme
   * @example
   * themeManager.toggleTheme();
   */
  toggleTheme() {
    const currentTheme = this.theme$.getValue();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Set a custom CSS token value
   * @param {string} tokenName - CSS custom property name (without --)
   * @param {string} value - CSS value
   * @example
   * themeManager.setToken('color-primary', '#ff0000');
   */
  setToken(tokenName, value) {
    this._customTokens.set(tokenName, value);
    this._applyCustomTokens();
    this._saveConfig();
  }

  /**
   * Set multiple custom tokens at once
   * @param {Record<string, string>} tokens - Map of token names to values
   * @example
   * themeManager.setTokens({
   *   'color-primary': '#ff0000',
   *   'color-secondary': '#00ff00'
   * });
   */
  setTokens(tokens) {
    Object.entries(tokens).forEach(([name, value]) => {
      this._customTokens.set(name, value);
    });
    this._applyCustomTokens();
    this._saveConfig();
  }

  /**
   * Remove a custom token override
   * @param {string} tokenName - CSS custom property name
   * @example
   * themeManager.removeToken('color-primary');
   */
  removeToken(tokenName) {
    this._customTokens.delete(tokenName);
    document.documentElement.style.removeProperty(`--${tokenName}`);
    this._saveConfig();
  }

  /**
   * Clear all custom token overrides
   * @example
   * themeManager.clearTokens();
   */
  clearTokens() {
    this._customTokens.forEach((_, tokenName) => {
      document.documentElement.style.removeProperty(`--${tokenName}`);
    });
    this._customTokens.clear();
    this._saveConfig();
  }

  /**
   * Get a CSS token value
   * @param {string} tokenName - CSS custom property name (without --)
   * @returns {string} Token value
   * @example
   * const primaryColor = themeManager.getToken('color-primary');
   */
  getToken(tokenName) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${tokenName}`)
      .trim();
  }

  /**
   * Get all token values
   * @returns {Record<string, string>} Map of all CSS custom properties
   * @example
   * const allTokens = themeManager.getAllTokens();
   */
  getAllTokens() {
    const styles = getComputedStyle(document.documentElement);
    const tokens = {};

    for (let i = 0; i < styles.length; i++) {
      const propName = styles[i];
      if (propName.startsWith('--')) {
        tokens[propName.substring(2)] = styles
          .getPropertyValue(propName)
          .trim();
      }
    }

    return tokens;
  }

  /**
   * Reset to default configuration
   * @example
   * themeManager.reset();
   */
  reset() {
    this.setTheme(this.options.defaultTheme);
    this.setDensity(this.options.defaultDensity);
    this.setScale(1);
    this.clearTokens();
  }

  /**
   * Export current configuration
   * @returns {DesignSystemConfig} Current configuration
   * @example
   * const config = themeManager.exportConfig();
   * localStorage.setItem('my-theme', JSON.stringify(config));
   */
  exportConfig() {
    return {
      theme: this.theme$.getValue(),
      density: this.density$.getValue(),
      scale: this.scale$.getValue(),
      reducedMotion: this.reducedMotion$.getValue(),
      darkMode: this.darkMode$.getValue(),
      tokens: Object.fromEntries(this._customTokens),
    };
  }

  /**
   * Import configuration
   * @param {DesignSystemConfig} config - Configuration to import
   * @example
   * const config = JSON.parse(localStorage.getItem('my-theme'));
   * themeManager.importConfig(config);
   */
  importConfig(config) {
    if (config.theme) {
      this.setTheme(config.theme);
    }
    if (config.density) {
      this.setDensity(config.density);
    }
    if (config.scale) {
      this.setScale(config.scale);
    }
    if (config.tokens) {
      this.setTokens(config.tokens);
    }
  }

  /**
   * Apply theme to document
   * @private
   */
  _applyTheme() {
    const theme = this.theme$.getValue();
    const density = this.density$.getValue();

    document.documentElement.setAttribute('data-theme', theme);

    if (density !== 'default') {
      document.documentElement.setAttribute('data-density', density);
    } else {
      document.documentElement.removeAttribute('data-density');
    }

    this._applyScale();
    this._applyCustomTokens();
  }

  /**
   * Apply scale factor
   * @private
   */
  _applyScale() {
    const scale = this.scale$.getValue();
    if (scale !== 1) {
      document.documentElement.style.setProperty(
        '--ui-scale',
        scale.toString()
      );
      document.documentElement.style.fontSize = `${scale * 16}px`;
    } else {
      document.documentElement.style.removeProperty('--ui-scale');
      document.documentElement.style.fontSize = '';
    }
  }

  /**
   * Apply custom token overrides
   * @private
   */
  _applyCustomTokens() {
    this._customTokens.forEach((value, tokenName) => {
      document.documentElement.style.setProperty(`--${tokenName}`, value);
    });
  }

  /**
   * Setup media query listeners
   * @private
   */
  _setupMediaQueryListeners() {
    // Dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const darkModeListener = (e) => this.darkMode$.next(e.matches);

    if (darkModeQuery.addEventListener) {
      darkModeQuery.addEventListener('change', darkModeListener);
    } else {
      darkModeQuery.addListener(darkModeListener);
    }

    // Reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionListener = (e) => this.reducedMotion$.next(e.matches);

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', motionListener);
    } else {
      motionQuery.addListener(motionListener);
    }
  }

  /**
   * Subscribe to observable changes
   * @private
   */
  _subscribeToChanges() {
    // Apply theme when it changes
    this.theme$.subscribe(() => {
      this._applyTheme();
      this._updateConfig();
      this._saveConfig();
    });

    // Apply density when it changes
    this.density$.subscribe(() => {
      this._applyTheme();
      this._updateConfig();
      this._saveConfig();
    });

    // Apply scale when it changes
    this.scale$.subscribe(() => {
      this._applyScale();
      this._updateConfig();
      this._saveConfig();
    });

    // Update config when system preferences change
    this.reducedMotion$.subscribe(() => this._updateConfig());
    this.darkMode$.subscribe(() => this._updateConfig());
  }

  /**
   * Build combined configuration
   * @private
   * @returns {DesignSystemConfig} Combined configuration
   */
  _buildConfig() {
    return {
      theme: this.theme$.getValue(),
      density: this.density$.getValue(),
      scale: this.scale$.getValue(),
      reducedMotion: this.reducedMotion$.getValue(),
      darkMode: this.darkMode$.getValue(),
    };
  }

  /**
   * Update config observable
   * @private
   */
  _updateConfig() {
    this.config$.next(this._buildConfig());
  }

  /**
   * Check if user prefers reduced motion
   * @private
   * @returns {boolean} True if prefers reduced motion
   */
  _prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if user prefers dark mode
   * @private
   * @returns {boolean} True if prefers dark mode
   */
  _prefersDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Load configuration from localStorage
   * @private
   * @returns {object} Saved configuration
   */
  _loadConfig() {
    if (!this.options.persistToLocalStorage) {
      return {};
    }

    try {
      const saved = localStorage.getItem(this.options.storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Failed to load design system config:', error);
      return {};
    }
  }

  /**
   * Save configuration to localStorage
   * @private
   */
  _saveConfig() {
    if (!this.options.persistToLocalStorage) {
      return;
    }

    try {
      const config = this.exportConfig();
      localStorage.setItem(this.options.storageKey, JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to save design system config:', error);
    }
  }

  /**
   * Clean up resources
   * @example
   * themeManager.destroy();
   */
  destroy() {
    this.theme$.complete();
    this.density$.complete();
    this.reducedMotion$.complete();
    this.darkMode$.complete();
    this.scale$.complete();
    this.config$.complete();
  }
}

/**
 * Singleton instance of ThemeManager
 * Use this for a shared instance across your application
 * @example
 * import { themeManager } from './theme-manager.js';
 *
 * themeManager.setTheme('dark');
 */
export const themeManager = new ThemeManager();
