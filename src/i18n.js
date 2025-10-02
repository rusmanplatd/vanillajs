import { BehaviorSubject } from '../packages/rxjs/cjs/index.js';

/**
 * I18n manager for internationalization with support for split JSON files
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
   */
  constructor(options = {}) {
    const {
      defaultLocale = 'en',
      fallbackLocale = 'en',
      translationsPath = '/i18n',
      preload = false,
      supportedLocales = ['en'],
    } = options;

    this.defaultLocale = defaultLocale;
    this.fallbackLocale = fallbackLocale;
    this.translationsPath = translationsPath;
    this.supportedLocales = supportedLocales;

    // Current locale as observable
    this.locale$ = new BehaviorSubject(defaultLocale);

    // Translation cache: { locale: { namespace: translations } }
    this._translations = new Map();

    // Loading state per locale
    this._loadingState = new Map();

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
   * Fetch translation file from server
   * @param {string} locale - Locale to fetch
   * @param {string} namespace - Namespace path
   * @returns {Promise<Object>} Translation data
   */
  async _fetchTranslation(locale, namespace) {
    const url = `${this.translationsPath}/${locale}/${namespace}.json`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to load translations: ${url} (${response.status})`
        );
      }

      return await response.json();
    } catch (error) {
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
   * @returns {Promise<string>} Translated string
   */
  async t(key, params = {}) {
    const locale = params.locale || this.getCurrentLocale();
    const { count, values = {} } = params;

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

    // Handle pluralization
    if (typeof count === 'number') {
      translation = this._pluralize(translation, count);
    }

    // Handle interpolation
    translation = this._interpolate(translation, values);

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
   * Handle pluralization
   * Supports formats:
   * - Object: { zero: '...', one: '...', other: '...' }
   * - String with pipes: 'no items|one item|{count} items'
   * @param {string|Object} translation - Translation value
   * @param {number} count - Count for pluralization
   * @returns {string} Pluralized string
   */
  _pluralize(translation, count) {
    if (typeof translation === 'object') {
      if (count === 0 && 'zero' in translation) {
        return translation.zero;
      }
      if (count === 1 && 'one' in translation) {
        return translation.one;
      }
      return translation.other || translation.many || '';
    }

    if (typeof translation === 'string' && translation.includes('|')) {
      const parts = translation.split('|');
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
   * Interpolate values into translation string
   * Supports: {key}, {{key}}, ${key}
   * @param {string} translation - Translation string
   * @param {Object} values - Values to interpolate
   * @returns {string} Interpolated string
   */
  _interpolate(translation, values) {
    if (typeof translation !== 'string') {
      return translation;
    }

    return translation.replace(
      /\{\{?(\w+)\}?\}?|\$\{(\w+)\}/g,
      (match, key1, key2) => {
        const key = key1 || key2;
        return key in values ? values[key] : match;
      }
    );
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
}

// Create and export default instance
export const i18n = new I18n({
  defaultLocale: 'en',
  fallbackLocale: 'en',
  translationsPath: '/i18n',
  supportedLocales: ['en', 'es', 'fr', 'de', 'ja', 'zh'],
});
