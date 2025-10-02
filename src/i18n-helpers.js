import { i18n } from './i18n.js';

/**
 * Translation directive for DOM elements
 * Usage: <div data-i18n="components/button.submit"></div>
 * With interpolation: <div data-i18n="pages/home.welcome" data-i18n-values='{"name":"John"}'></div>
 */
export class I18nDirective {
  /**
   * Initialize i18n directives on the page
   * @param {HTMLElement} root - Root element to scan
   */
  static init(root = document.body) {
    const directive = new I18nDirective(root);
    directive.scan();
    directive.observeLocaleChanges();
    return directive;
  }

  /**
   * Creates an I18nDirective instance
   * @param {HTMLElement} root - Root element
   */
  constructor(root = document.body) {
    this.root = root;
    this.elements = new Set();
  }

  /**
   * Scan for elements with i18n attributes
   */
  scan() {
    const elements = this.root.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      this.elements.add(el);
      this.translateElement(el);
    });
  }

  /**
   * Translate a single element
   * @param {HTMLElement} element - Element to translate
   */
  async translateElement(element) {
    const key = element.getAttribute('data-i18n');
    const valuesAttr = element.getAttribute('data-i18n-values');
    const target = element.getAttribute('data-i18n-target') || 'text';

    let values = {};
    if (valuesAttr) {
      try {
        values = JSON.parse(valuesAttr);
      } catch (error) {
        console.warn('Invalid data-i18n-values JSON:', valuesAttr);
      }
    }

    const translation = await i18n.t(key, { values });

    switch (target) {
      case 'html':
        element.innerHTML = translation;
        break;
      case 'placeholder':
        element.placeholder = translation;
        break;
      case 'title':
        element.title = translation;
        break;
      case 'aria-label':
        element.setAttribute('aria-label', translation);
        break;
      default:
        element.textContent = translation;
    }
  }

  /**
   * Observe locale changes and update translations
   */
  observeLocaleChanges() {
    this.subscription = i18n.locale$.subscribe(() => {
      this.elements.forEach((el) => this.translateElement(el));
    });
  }

  /**
   * Destroy directive and cleanup
   */
  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.elements.clear();
  }
}

/**
 * Helper to create translated elements dynamically
 * @param {string} tag - HTML tag name
 * @param {string} key - Translation key
 * @param {Object} options - Options
 * @returns {HTMLElement} Created element
 */
export async function createTranslatedElement(tag, key, options = {}) {
  const element = document.createElement(tag);
  const { values = {}, target = 'text', attributes = {} } = options;

  element.setAttribute('data-i18n', key);

  if (Object.keys(values).length > 0) {
    element.setAttribute('data-i18n-values', JSON.stringify(values));
  }

  if (target !== 'text') {
    element.setAttribute('data-i18n-target', target);
  }

  Object.entries(attributes).forEach(([attr, value]) => {
    element.setAttribute(attr, value);
  });

  const translation = await i18n.t(key, { values });

  switch (target) {
    case 'html':
      element.innerHTML = translation;
      break;
    case 'placeholder':
      element.placeholder = translation;
      break;
    case 'title':
      element.title = translation;
      break;
    default:
      element.textContent = translation;
  }

  return element;
}

/**
 * Format date with locale
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export function formatDate(date, options = {}) {
  const locale = i18n.getCurrentLocale();
  const dateObj = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format number with locale
 * @param {number} number - Number to format
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} Formatted number
 */
export function formatNumber(number, options = {}) {
  const locale = i18n.getCurrentLocale();
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Format currency with locale
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (e.g., 'USD')
 * @param {Object} options - Additional options
 * @returns {string} Formatted currency
 */
export function formatCurrency(amount, currency = 'USD', options = {}) {
  const locale = i18n.getCurrentLocale();
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(amount);
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.RelativeTimeFormat options
 * @returns {string} Formatted relative time
 */
export function formatRelativeTime(date, options = {}) {
  const locale = i18n.getCurrentLocale();
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    ...options,
  });

  if (Math.abs(diffYears) >= 1) {
    return rtf.format(diffYears, 'year');
  }
  if (Math.abs(diffMonths) >= 1) {
    return rtf.format(diffMonths, 'month');
  }
  if (Math.abs(diffDays) >= 1) {
    return rtf.format(diffDays, 'day');
  }
  if (Math.abs(diffHours) >= 1) {
    return rtf.format(diffHours, 'hour');
  }
  if (Math.abs(diffMinutes) >= 1) {
    return rtf.format(diffMinutes, 'minute');
  }
  return rtf.format(diffSeconds, 'second');
}

/**
 * Get list of supported locales with native names
 * @returns {Array<Object>} Array of locale objects
 */
export function getSupportedLocales() {
  const localeNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    ja: '日本語',
    zh: '中文',
  };

  return i18n.supportedLocales.map((code) => ({
    code,
    name: localeNames[code] || code,
    native: localeNames[code] || code,
  }));
}

/**
 * Language switcher component
 */
export class LanguageSwitcher {
  /**
   * Create a language switcher
   * @param {HTMLElement} container - Container element
   * @param {Object} options - Options
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      type: 'dropdown', // 'dropdown' or 'buttons'
      showFlag: false,
      className: 'language-switcher',
      ...options,
    };

    this.render();
    this.attachEvents();
  }

  /**
   * Render the language switcher
   */
  render() {
    const locales = getSupportedLocales();
    const currentLocale = i18n.getCurrentLocale();

    if (this.options.type === 'dropdown') {
      this.element = document.createElement('select');
      this.element.className = this.options.className;

      locales.forEach((locale) => {
        const option = document.createElement('option');
        option.value = locale.code;
        option.textContent = locale.native;
        if (locale.code === currentLocale) {
          option.selected = true;
        }
        this.element.appendChild(option);
      });
    } else {
      this.element = document.createElement('div');
      this.element.className = this.options.className;

      locales.forEach((locale) => {
        const button = document.createElement('button');
        button.className = 'language-button';
        button.dataset.locale = locale.code;
        button.textContent = locale.native;

        if (locale.code === currentLocale) {
          button.classList.add('active');
        }

        this.element.appendChild(button);
      });
    }

    this.container.appendChild(this.element);
  }

  /**
   * Attach event listeners
   */
  attachEvents() {
    if (this.options.type === 'dropdown') {
      this.element.addEventListener('change', (e) => {
        i18n.setLocale(e.target.value);
      });
    } else {
      this.element.addEventListener('click', (e) => {
        if (e.target.classList.contains('language-button')) {
          const locale = e.target.dataset.locale;
          i18n.setLocale(locale);

          // Update active state
          this.element
            .querySelectorAll('.language-button')
            .forEach((btn) => btn.classList.remove('active'));
          e.target.classList.add('active');
        }
      });
    }

    // Update on locale change from other sources
    this.subscription = i18n.locale$.subscribe((locale) => {
      if (this.options.type === 'dropdown') {
        this.element.value = locale;
      } else {
        this.element
          .querySelectorAll('.language-button')
          .forEach((btn) => btn.classList.remove('active'));
        const activeBtn = this.element.querySelector(
          `[data-locale="${locale}"]`
        );
        if (activeBtn) {
          activeBtn.classList.add('active');
        }
      }
    });
  }

  /**
   * Destroy the switcher
   */
  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.element.remove();
  }
}
