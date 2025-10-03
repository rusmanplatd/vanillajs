import { i18n } from './i18n.js';

/**
 * Translation directive for DOM elements with MutationObserver support
 * Usage: <div data-i18n="components/button.submit"></div>
 * With interpolation: <div data-i18n="pages/home.welcome" data-i18n-values='{"name":"John"}'></div>
 */
export class I18nDirective {
  /**
   * Initialize i18n directives on the page
   * @param {HTMLElement} root - Root element to scan
   * @param {object} options - Configuration options
   * @param {boolean} options.autoObserve - Automatically observe DOM changes
   */
  static init(root = document.body, options = {}) {
    const directive = new I18nDirective(root, options);
    directive.scan();
    directive.observeLocaleChanges();

    if (options.autoObserve !== false) {
      directive.observeDOMChanges();
    }

    return directive;
  }

  /**
   * Creates an I18nDirective instance
   * @param {HTMLElement} root - Root element
   * @param {object} options - Configuration options
   */
  constructor(root = document.body, options = {}) {
    this.root = root;
    this.elements = new WeakSet();
    this.options = options;
    this.mutationObserver = null;
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
   * Observe DOM changes and translate new elements automatically
   */
  observeDOMChanges() {
    this.mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check the node itself
              if (node.hasAttribute('data-i18n')) {
                this.elements.add(node);
                this.translateElement(node);
              }

              // Check descendants
              const descendants = node.querySelectorAll('[data-i18n]');
              descendants.forEach((el) => {
                this.elements.add(el);
                this.translateElement(el);
              });
            }
          });
        } else if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-i18n'
        ) {
          const el = mutation.target;
          this.elements.add(el);
          this.translateElement(el);
        }
      }
    });

    this.mutationObserver.observe(this.root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-i18n', 'data-i18n-values'],
    });
  }

  /**
   * Translate a single element with enhanced attribute support
   * @param {HTMLElement} element - Element to translate
   */
  async translateElement(element) {
    const key = element.getAttribute('data-i18n');
    if (!key) {
      return;
    }

    const valuesAttr = element.getAttribute('data-i18n-values');
    const countAttr = element.getAttribute('data-i18n-count');
    const target = element.getAttribute('data-i18n-target') || 'text';
    const defaultValue = element.getAttribute('data-i18n-default');

    let values = {};
    if (valuesAttr) {
      try {
        values = JSON.parse(valuesAttr);
      } catch (error) {
        console.warn('Invalid data-i18n-values JSON:', valuesAttr);
      }
    }

    const params = { values };

    if (countAttr !== null) {
      params.count = parseInt(countAttr, 10);
    }

    if (defaultValue) {
      params.defaultValue = defaultValue;
    }

    const translation = await i18n.t(key, params);

    // Support multiple targets separated by comma
    const targets = target.split(',').map((t) => t.trim());

    for (const t of targets) {
      switch (t) {
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
        case 'value':
          element.value = translation;
          break;
        case 'alt':
          element.alt = translation;
          break;
        case 'text':
        default:
          element.textContent = translation;
      }
    }
  }

  /**
   * Observe locale changes and update translations
   */
  observeLocaleChanges() {
    this.subscription = i18n.locale$.subscribe(() => {
      // Re-scan all elements
      const elements = this.root.querySelectorAll('[data-i18n]');
      elements.forEach((el) => this.translateElement(el));
    });
  }

  /**
   * Destroy directive and cleanup
   */
  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    this.elements = new WeakSet();
  }
}

/**
 * Helper to create translated elements dynamically
 * @param {string} tag - HTML tag name
 * @param {string} key - Translation key
 * @param {object} options - Options
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
 * @param {object} options - Intl.DateTimeFormat options
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
 * @param {object} options - Intl.NumberFormat options
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
 * @param {object} options - Additional options
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
 * @param {object} options - Intl.RelativeTimeFormat options
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
 * @returns {Array<object>} Array of locale objects
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
 * Format list with locale-aware conjunction
 * @param {Array} items - Items to format
 * @param {object} options - Intl.ListFormat options
 * @returns {string} Formatted list
 */
export function formatList(items, options = {}) {
  const locale = i18n.getCurrentLocale();

  if (!Intl.ListFormat) {
    // Fallback for browsers without ListFormat
    return items.join(', ');
  }

  return new Intl.ListFormat(locale, {
    style: 'long',
    type: 'conjunction',
    ...options,
  }).format(items);
}

/**
 * Get text direction for current locale
 * @returns {string} 'ltr' or 'rtl'
 */
export function getTextDirection() {
  const locale = i18n.getCurrentLocale();
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];

  return rtlLocales.some((rtl) => locale.startsWith(rtl)) ? 'rtl' : 'ltr';
}

/**
 * Apply text direction to element
 * @param {HTMLElement} element - Element to apply direction to
 */
export function applyTextDirection(element = document.documentElement) {
  const dir = getTextDirection();
  element.setAttribute('dir', dir);
}

/**
 * Translation hook for reactive frameworks
 * Returns a function that gets the current translation and updates on locale change
 * @param {string} key - Translation key
 * @param {object} params - Translation parameters
 * @returns {object} Object with translation value and update function
 */
export function useTranslation(key, params = {}) {
  let currentValue = key;

  const update = async () => {
    currentValue = await i18n.t(key, params);
    return currentValue;
  };

  const subscription = i18n.locale$.subscribe(() => {
    update();
  });

  // Initial load
  update();

  return {
    get value() {
      return currentValue;
    },
    update,
    destroy: () => subscription.unsubscribe(),
  };
}

/**
 * Language switcher component with enhanced features
 */
export class LanguageSwitcher {
  /**
   * Create a language switcher
   * @param {HTMLElement} container - Container element
   * @param {object} options - Options
   * @param {string} options.type - 'dropdown' or 'buttons'
   * @param {boolean} options.showFlag - Show country flags
   * @param {string} options.className - CSS class name
   * @param {Function} options.onChange - Callback when language changes
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      type: 'dropdown', // 'dropdown' or 'buttons'
      showFlag: false,
      className: 'language-switcher',
      onChange: null,
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
      this.element.addEventListener('change', async (e) => {
        const newLocale = e.target.value;
        await i18n.setLocale(newLocale);

        if (this.options.onChange) {
          this.options.onChange(newLocale);
        }
      });
    } else {
      this.element.addEventListener('click', async (e) => {
        if (e.target.classList.contains('language-button')) {
          const { locale } = e.target.dataset;
          await i18n.setLocale(locale);

          // Update active state
          this.element
            .querySelectorAll('.language-button')
            .forEach((btn) => btn.classList.remove('active'));
          e.target.classList.add('active');

          if (this.options.onChange) {
            this.options.onChange(locale);
          }
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

      // Apply text direction
      applyTextDirection();
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
