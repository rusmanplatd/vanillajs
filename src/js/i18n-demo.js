import { i18n } from ../src/js/i18n.js';
import {
  I18nDirective,
  LanguageSwitcher,
  formatDate,
  formatNumber,
  formatCurrency,
  formatRelativeTime,
} from ../src/js/i18n-helpers.js';

/**
 * I18n Demo Application
 */
class I18nDemoApp {
  /**
   * Initialize the demo application
   */
  constructor() {
    this.init();
  }

  /**
   * Initialize all components
   */
  async init() {
    // Preload common namespaces
    await this.preloadTranslations();

    // Initialize language switcher
    this.initLanguageSwitcher();

    // Initialize i18n directives
    this.directive = I18nDirective.init();

    // Setup interactive demos
    this.setupInterpolationDemo();
    this.setupPluralizationDemo();
    this.setupFormattingDemo();

    // Listen for locale changes
    this.observeLocaleChanges();

    console.log('I18n Demo initialized');
  }

  /**
   * Preload translation files
   */
  async preloadTranslations() {
    const namespaces = [
      'common',
      'components/button',
      'components/navigation',
      'pages/home',
    ];

    try {
      await i18n.loadNamespaces(i18n.getCurrentLocale(), namespaces);
      console.log('Translations loaded for', i18n.getCurrentLocale());
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  /**
   * Initialize language switcher
   */
  initLanguageSwitcher() {
    const container = document.getElementById('languageSwitcher');
    if (container) {
      this.languageSwitcher = new LanguageSwitcher(container, {
        type: 'buttons',
        className: 'language-switcher',
      });
    }
  }

  /**
   * Setup interpolation demo
   */
  setupInterpolationDemo() {
    const nameInput = document.getElementById('nameInput');
    const output = document.getElementById('interpolationOutput');

    const updateInterpolation = async () => {
      const name = nameInput.value || 'Guest';
      const translation = await i18n.t('pages/home.welcome', {
        values: { name },
      });
      output.textContent = translation;
    };

    if (nameInput) {
      nameInput.addEventListener('input', updateInterpolation);
      updateInterpolation();
    }
  }

  /**
   * Setup pluralization demo
   */
  setupPluralizationDemo() {
    const countInput = document.getElementById('countInput');
    const output = document.getElementById('pluralizationOutput');

    const updatePluralization = async () => {
      const count = parseInt(countInput.value, 10) || 0;
      const items = await i18n.t('common.plurals.items', { count });
      const users = await i18n.t('common.plurals.users', { count });
      const results = await i18n.t('common.plurals.results', { count });

      output.innerHTML = `
        <div>Items: <strong>${items}</strong></div>
        <div>Users: <strong>${users}</strong></div>
        <div>Results: <strong>${results}</strong></div>
      `;
    };

    if (countInput) {
      countInput.addEventListener('input', updatePluralization);
      updatePluralization();
    }
  }

  /**
   * Setup formatting demo
   */
  setupFormattingDemo() {
    const container = document.getElementById('formattingExamples');

    if (!container) {
      return;
    }

    const updateFormatting = () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
      const amount = 1234567.89;

      container.innerHTML = `
        <div class="format-demo">
          <div class="format-label">Date (Short):</div>
          <div class="format-value">${formatDate(now, {
            dateStyle: 'short',
          })}</div>
        </div>
        <div class="format-demo">
          <div class="format-label">Date (Long):</div>
          <div class="format-value">${formatDate(now, {
            dateStyle: 'long',
          })}</div>
        </div>
        <div class="format-demo">
          <div class="format-label">Date & Time:</div>
          <div class="format-value">${formatDate(now, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}</div>
        </div>
        <div class="format-demo">
          <div class="format-label">Relative Time:</div>
          <div class="format-value">${formatRelativeTime(pastDate)}</div>
        </div>
        <div class="format-demo">
          <div class="format-label">Number:</div>
          <div class="format-value">${formatNumber(amount)}</div>
        </div>
        <div class="format-demo">
          <div class="format-label">Currency (USD):</div>
          <div class="format-value">${formatCurrency(amount, 'USD')}</div>
        </div>
        <div class="format-demo">
          <div class="format-label">Currency (EUR):</div>
          <div class="format-value">${formatCurrency(amount, 'EUR')}</div>
        </div>
        <div class="format-demo">
          <div class="format-label">Percentage:</div>
          <div class="format-value">${formatNumber(0.875, {
            style: 'percent',
          })}</div>
        </div>
      `;
    };

    updateFormatting();

    // Update formatting when locale changes
    i18n.locale$.subscribe(() => {
      updateFormatting();
    });
  }

  /**
   * Observe locale changes
   */
  observeLocaleChanges() {
    this.subscription = i18n.locale$.subscribe(async (locale) => {
      console.log('Locale changed to:', locale);

      // Reload translations for new locale
      await this.preloadTranslations();

      // Update demos
      this.setupInterpolationDemo();
      this.setupPluralizationDemo();
    });
  }

  /**
   * Destroy the application
   */
  destroy() {
    if (this.directive) {
      this.directive.destroy();
    }
    if (this.languageSwitcher) {
      this.languageSwitcher.destroy();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.i18nDemo = new I18nDemoApp();
  });
} else {
  window.i18nDemo = new I18nDemoApp();
}
