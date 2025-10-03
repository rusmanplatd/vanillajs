import { BehaviorSubject } from '../packages/rxjs/cjs/index.js';

/**
 * I18n manager for internationalization with support for split JSON files
 * Modern implementation with performance optimizations and advanced features
 * Supports structure: /i18n/{lang}/{components,pages,etc}/{name}.json or nested folders
 */
export class I18n {
  /**
   * Creates an I18n instance
   * @param {Object} options - Configuration options
   * @param {string} options.defaultLocale - Default language locale (e.g., 'en')
   * @param {string} options.fallbackLocale - Fallback language if translation missing
   * @param {string} options.translationsPath - Base path for translations (default: '/i18n')
   * @param {boolean} options.preload - Whether to preload all translations
   * @param {string[]} options.supportedLocales - List of supported locales
   * @param {boolean} options.debug - Enable debug logging
   * @param {Function} options.onMissingTranslation - Custom handler for missing translations
   * @param {AbortController} options.abortController - Controller for cancelling requests
   */
  constructor(options = {}) {
    const {
      defaultLocale = 'en',
      fallbackLocale = 'en',
      translationsPath = '/i18n',
      preload = false,
      supportedLocales = ['en'],
      debug = false,
      onMissingTranslation = null,
      abortController = null,
    } = options;

    this.defaultLocale = defaultLocale;
    this.fallbackLocale = fallbackLocale;
    this.translationsPath = translationsPath;
    this.supportedLocales = supportedLocales;
    this.debug = debug;
    this.onMissingTranslation = onMissingTranslation;
    this.abortController = abortController;

    // Current locale as observable
    this.locale$ = new BehaviorSubject(defaultLocale);

    // Translation cache using nested Maps for better performance
    this._translations = new Map();

    // Loading state per locale
    this._loadingState = new Map();

    // Missing translations tracker
    this._missingKeys = new Set();

    // Persist locale to localStorage
    this._loadPersistedLocale();

    if (preload) {
      this.preloadLocales(supportedLocales);
    }
  }

  /**
   * Load persisted locale from localStorage
   */
  _loadPersistedLocale() {
    try {
      const saved = localStorage.getItem('i18n-locale');
      if (saved && this.supportedLocales.includes(saved)) {
        this.locale$.next(saved);
      }
    } catch (error) {
      console.warn('Failed to load persisted locale:', error);
    }
  }

  /**
   * Get current locale
   * @returns {string} Current locale
   */
  getCurrentLocale() {
    return this.locale$.getValue();
  }

  /**
   * Set current locale
   * @param {string} locale - Locale to set
   * @returns {Promise<void>}
   */
  async setLocale(locale) {
    if (!this.supportedLocales.includes(locale)) {
      console.warn(`Locale ${locale} is not supported`);
      return;
    }

    this.locale$.next(locale);

    try {
      localStorage.setItem('i18n-locale', locale);
    } catch (error) {
      console.warn('Failed to persist locale:', error);
    }
  }

  /**
   * Load translations from a JSON file
   * @param {string} locale - Locale to load
   * @param {string} namespace - Namespace (e.g., 'components/button', 'pages/home')
   * @returns {Promise<Object>} Loaded translations
   */
  async loadTranslation(locale, namespace) {
    const cacheKey = `${locale}:${namespace}`;

    // Check if already loaded
    if (this._translations.has(cacheKey)) {
      return this._translations.get(cacheKey);
    }

    // Check if currently loading
    if (this._loadingState.has(cacheKey)) {
      return this._loadingState.get(cacheKey);
    }

    // Start loading
    const loadPromise = this._fetchTranslation(locale, namespace);
    this._loadingState.set(cacheKey, loadPromise);

    try {
      const translations = await loadPromise;
      this._translations.set(cacheKey, translations);
      this._loadingState.delete(cacheKey);
      return translations;
    } catch (error) {
      this._loadingState.delete(cacheKey);
      throw error;
    }
  }

  /**
   * Fetch translation file from server with modern fetch API
   * @param {string} locale - Locale to fetch
   * @param {string} namespace - Namespace path
   * @returns {Promise<Object>} Translation data
   */
  async _fetchTranslation(locale, namespace) {
    const url = `${this.translationsPath}/${locale}/${namespace}.json`;

    try {
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (this.abortController) {
        fetchOptions.signal = this.abortController.signal;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(
          `Failed to load translations: ${url} (${response.status})`
        );
      }

      const data = await response.json();

      if (this.debug) {
        console.log(`[i18n] Loaded namespace "${namespace}" for "${locale}"`);
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        if (this.debug) {
          console.log(`[i18n] Fetch aborted: ${url}`);
        }
        return {};
      }

      console.error(`Error loading translation ${url}:`, error);
      return {};
    }
  }

  /**
   * Load all translations for a locale from a directory
   * Recursively loads all JSON files in the locale directory
   * @param {string} locale - Locale to load
   * @param {string[]} namespaces - Array of namespaces to load
   * @returns {Promise<void>}
   */
  async loadNamespaces(locale, namespaces) {
    const promises = namespaces.map((namespace) =>
      this.loadTranslation(locale, namespace)
    );
    await Promise.all(promises);
  }

  /**
   * Preload translations for multiple locales
   * @param {string[]} locales - Locales to preload
   * @param {string[]} namespaces - Namespaces to preload
   * @returns {Promise<void>}
   */
  async preloadLocales(locales, namespaces = []) {
    for (const locale of locales) {
      if (namespaces.length > 0) {
        await this.loadNamespaces(locale, namespaces);
      }
    }
  }

  /**
   * Get translation by key with interpolation and pluralization
   * @param {string} key - Translation key (e.g., 'components/button.submit')
   * @param {Object} params - Parameters for interpolation and pluralization
   * @param {string} params.locale - Override current locale
   * @param {number} params.count - Count for pluralization
   * @param {Object} params.values - Values for interpolation
   * @param {string} params.defaultValue - Default value if translation missing
   * @returns {Promise<string>} Translated string
   */
  async t(key, params = {}) {
    const locale = params.locale || this.getCurrentLocale();
    const { count, values = {}, defaultValue } = params;

    // Parse key: 'components/button.submit' -> namespace: 'components/button', path: 'submit'
    const { namespace, path } = this._parseKey(key);

    // Load translation if not cached
    await this.loadTranslation(locale, namespace);

    // Get translation value
    let translation = this._getTranslation(locale, namespace, path);

    // Try fallback locale if not found
    if (translation === path && locale !== this.fallbackLocale) {
      await this.loadTranslation(this.fallbackLocale, namespace);
      translation = this._getTranslation(this.fallbackLocale, namespace, path);
    }

    // Handle missing translation
    if (translation === path) {
      this._handleMissingTranslation(key, locale);

      if (defaultValue !== undefined) {
        translation = defaultValue;
      }
    }

    // Handle pluralization
    if (typeof count === 'number') {
      translation = this._pluralize(translation, count, locale);
    }

    // Handle interpolation
    translation = this._interpolate(translation, { ...values, count });

    return translation;
  }

  /**
   * Synchronous translation getter (only works if already loaded)
   * @param {string} key - Translation key
   * @param {Object} params - Parameters
   * @returns {string} Translated string or key if not found
   */
  tSync(key, params = {}) {
    const locale = params.locale || this.getCurrentLocale();
    const { count, values = {} } = params;

    const { namespace, path } = this._parseKey(key);

    let translation = this._getTranslation(locale, namespace, path);

    if (translation === path && locale !== this.fallbackLocale) {
      translation = this._getTranslation(this.fallbackLocale, namespace, path);
    }

    if (typeof count === 'number') {
      translation = this._pluralize(translation, count);
    }

    translation = this._interpolate(translation, values);

    return translation;
  }

  /**
   * Parse translation key into namespace and path
   * @param {string} key - Full key (e.g., 'components/button.submit')
   * @returns {Object} Parsed key with namespace and path
   */
  _parseKey(key) {
    const lastDotIndex = key.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return { namespace: 'common', path: key };
    }

    const namespace = key.substring(0, lastDotIndex);
    const path = key.substring(lastDotIndex + 1);

    return { namespace, path };
  }

  /**
   * Get translation from cache
   * @param {string} locale - Locale
   * @param {string} namespace - Namespace
   * @param {string} path - Dot-notation path
   * @returns {string|Object} Translation value
   */
  _getTranslation(locale, namespace, path) {
    const cacheKey = `${locale}:${namespace}`;
    const translations = this._translations.get(cacheKey);

    if (!translations) {
      return path;
    }

    // Support nested paths: 'user.name' -> translations.user.name
    const parts = path.split('.');
    let value = translations;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return path;
      }
    }

    return typeof value === 'string' ? value : path;
  }

  /**
   * Handle missing translation
   * @param {string} key - Missing translation key
   * @param {string} locale - Current locale
   */
  _handleMissingTranslation(key, locale) {
    const missingKey = `${locale}:${key}`;

    if (!this._missingKeys.has(missingKey)) {
      this._missingKeys.add(missingKey);

      if (this.debug) {
        console.warn(`[i18n] Missing translation: "${key}" for locale "${locale}"`);
      }

      if (this.onMissingTranslation) {
        this.onMissingTranslation(key, locale);
      }
    }
  }

  /**
   * Get missing translations
   * @returns {Array<string>} Array of missing translation keys
   */
  getMissingTranslations() {
    return Array.from(this._missingKeys);
  }

  /**
   * Clear missing translations tracker
   */
  clearMissingTranslations() {
    this._missingKeys.clear();
  }

  /**
   * Handle pluralization with Intl.PluralRules support
   * Supports formats:
   * - Object: { zero: '...', one: '...', two: '...', few: '...', many: '...', other: '...' }
   * - String with pipes: 'no items|one item|{count} items'
   * @param {string|Object} translation - Translation value
   * @param {number} count - Count for pluralization
   * @param {string} locale - Locale for plural rules
   * @returns {string} Pluralized string
   */
  _pluralize(translation, count, locale) {
    if (typeof translation === 'object') {
      // Use Intl.PluralRules for accurate pluralization
      const pr = new Intl.PluralRules(locale);
      const rule = pr.select(count);

      // Check for explicit count match first
      if (count === 0 && 'zero' in translation) {
        return translation.zero;
      }

      // Then check plural rules
      if (rule in translation) {
        return translation[rule];
      }

      // Fallback chain
      return translation.other || translation.many || '';
    }

    if (typeof translation === 'string' && translation.includes('|')) {
      const parts = translation.split('|').map((p) => p.trim());

      // Simple pipe format: zero|one|other
      if (count === 0 && parts[0]) {
        return parts[0];
      }
      if (count === 1 && parts[1]) {
        return parts[1];
      }
      return parts[2] || parts[parts.length - 1] || '';
    }

    return translation;
  }

  /**
   * Interpolate values into translation string with nested object support
   * Supports: {key}, {{key}}, ${key}, {user.name}, {items[0]}
   * @param {string} translation - Translation string
   * @param {Object} values - Values to interpolate
   * @returns {string} Interpolated string
   */
  _interpolate(translation, values) {
    if (typeof translation !== 'string') {
      return translation;
    }

    return translation.replace(
      /\{\{?([\w.[\]]+)\}?\}?|\$\{([\w.[\]]+)\}/g,
      (match, key1, key2) => {
        const key = key1 || key2;

        // Support nested keys: user.name, items[0]
        const value = this._getNestedValue(values, key);

        if (value !== undefined && value !== null) {
          return String(value);
        }

        return match;
      }
    );
  }

  /**
   * Get nested value from object using dot notation or bracket notation
   * @param {Object} obj - Object to traverse
   * @param {string} path - Path to value (e.g., 'user.name', 'items[0]')
   * @returns {*} Value at path or undefined
   */
  _getNestedValue(obj, path) {
    // Handle simple keys first
    if (path in obj) {
      return obj[path];
    }

    // Handle nested paths
    const keys = path.split(/[.[\]]+/).filter(Boolean);
    let current = obj;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * Check if a translation exists
   * @param {string} key - Translation key
   * @param {string} locale - Locale to check
   * @returns {boolean} True if translation exists
   */
  has(key, locale = null) {
    const targetLocale = locale || this.getCurrentLocale();
    const { namespace, path } = this._parseKey(key);
    const cacheKey = `${targetLocale}:${namespace}`;
    const translations = this._translations.get(cacheKey);

    if (!translations) {
      return false;
    }

    const parts = path.split('.');
    let value = translations;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return false;
      }
    }

    return typeof value === 'string';
  }

  /**
   * Get all translations for a namespace
   * @param {string} namespace - Namespace to get
   * @param {string} locale - Locale
   * @returns {Object|null} All translations in namespace
   */
  getNamespace(namespace, locale = null) {
    const targetLocale = locale || this.getCurrentLocale();
    const cacheKey = `${targetLocale}:${namespace}`;
    return this._translations.get(cacheKey) || null;
  }

  /**
   * Clear all cached translations
   */
  clearCache() {
    this._translations.clear();
  }

  /**
   * Clear cache for specific locale
   * @param {string} locale - Locale to clear
   */
  clearLocale(locale) {
    const keysToDelete = [];
    for (const key of this._translations.keys()) {
      if (key.startsWith(`${locale}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this._translations.delete(key));
  }

  /**
   * Batch translate multiple keys at once
   * @param {string[]} keys - Array of translation keys
   * @param {Object} params - Parameters for all translations
   * @returns {Promise<Object>} Object with keys and translations
   */
  async batchTranslate(keys, params = {}) {
    const results = {};

    await Promise.all(
      keys.map(async (key) => {
        results[key] = await this.t(key, params);
      })
    );

    return results;
  }

  /**
   * Get all translations for current locale
   * @returns {Object} All loaded translations
   */
  getAllTranslations() {
    const locale = this.getCurrentLocale();
    const translations = {};

    for (const [key, value] of this._translations.entries()) {
      if (key.startsWith(`${locale}:`)) {
        const namespace = key.substring(locale.length + 1);
        translations[namespace] = value;
      }
    }

    return translations;
  }

  /**
   * Validate that all required translation keys exist
   * @param {string[]} requiredKeys - Array of required translation keys
   * @param {string} locale - Locale to check (defaults to current)
   * @returns {Promise<Object>} Validation result with missing keys
   */
  async validateTranslations(requiredKeys, locale = null) {
    const targetLocale = locale || this.getCurrentLocale();
    const missing = [];
    const found = [];

    for (const key of requiredKeys) {
      const { namespace } = this._parseKey(key);
      await this.loadTranslation(targetLocale, namespace);

      if (this.has(key, targetLocale)) {
        found.push(key);
      } else {
        missing.push(key);
      }
    }

    return {
      valid: missing.length === 0,
      locale: targetLocale,
      found,
      missing,
      coverage: (found.length / requiredKeys.length) * 100,
    };
  }

  /**
   * Export translations to JSON
   * @param {string} locale - Locale to export
   * @returns {string} JSON string of all translations
   */
  exportTranslations(locale = null) {
    const targetLocale = locale || this.getCurrentLocale();
    const translations = {};

    for (const [key, value] of this._translations.entries()) {
      if (key.startsWith(`${targetLocale}:`)) {
        const namespace = key.substring(targetLocale.length + 1);
        translations[namespace] = value;
      }
    }

    return JSON.stringify(translations, null, 2);
  }

  /**
   * Get translation statistics
   * @returns {Object} Statistics about loaded translations
   */
  getStats() {
    const stats = {
      currentLocale: this.getCurrentLocale(),
      supportedLocales: this.supportedLocales,
      loadedNamespaces: {},
      totalKeys: 0,
      missingKeys: this._missingKeys.size,
      cacheSize: this._translations.size,
    };

    for (const [cacheKey, translations] of this._translations.entries()) {
      const [locale, namespace] = cacheKey.split(':');

      if (!stats.loadedNamespaces[locale]) {
        stats.loadedNamespaces[locale] = [];
      }

      stats.loadedNamespaces[locale].push(namespace);

      // Count keys recursively
      const countKeys = (obj) => {
        let count = 0;
        for (const value of Object.values(obj)) {
          if (typeof value === 'string') {
            count++;
          } else if (typeof value === 'object' && value !== null) {
            count += countKeys(value);
          }
        }
        return count;
      };

      stats.totalKeys += countKeys(translations);
    }

    return stats;
  }
}

// Create and export default instance
export const i18n = new I18n({
  defaultLocale: 'en',
  fallbackLocale: 'en',
  translationsPath: '/i18n',
  supportedLocales: ['en', 'es', 'fr', 'de', 'ja', 'zh'],
});
