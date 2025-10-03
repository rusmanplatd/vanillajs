# i18n System Improvements

## Overview

The i18n system has been significantly enhanced with modern features, better performance, and improved developer experience. All improvements maintain the existing API while adding powerful new capabilities.

## New Features

### 1. **Advanced Error Handling & Debugging**

#### Debug Mode
```javascript
import { I18n } from './src/i18n.js';

const i18n = new I18n({
  defaultLocale: 'en',
  debug: true, // Enable debug logging
});

// Logs: [i18n] Loaded namespace "common" for "en"
// Logs: [i18n] Missing translation: "invalid.key" for locale "en"
```

#### Missing Translation Tracking
```javascript
// Automatic tracking of missing translations
await i18n.t('missing.key');

// Get all missing translations
const missing = i18n.getMissingTranslations();
console.log(missing); // ['en:missing.key']

// Clear tracker
i18n.clearMissingTranslations();
```

#### Custom Missing Translation Handler
```javascript
const i18n = new I18n({
  defaultLocale: 'en',
  onMissingTranslation: (key, locale) => {
    // Send to error tracking service
    errorTracker.log('Missing translation', { key, locale });
  },
});
```

#### Default Values
```javascript
// Provide fallback when translation is missing
const text = await i18n.t('missing.key', {
  defaultValue: 'Default text',
});
// Returns: 'Default text'
```

### 2. **Enhanced Pluralization with Intl.PluralRules**

Now uses native `Intl.PluralRules` for accurate locale-specific pluralization:

```javascript
// Translation file
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "two": "Two items",      // For languages with dual form
    "few": "Few items",      // For Slavic languages
    "many": "Many items",    // For Russian, Polish, etc.
    "other": "{count} items"
  }
}

// Usage
await i18n.t('items', { count: 0 });  // "No items"
await i18n.t('items', { count: 1 });  // "One item"
await i18n.t('items', { count: 5 });  // "5 items" (or "Few items" in Slavic)
```

### 3. **Nested Value Interpolation**

Support for nested object values and array indexing:

```javascript
const translation = "Welcome {user.name}, you have {notifications[0]} new messages";

await i18n.t('welcome', {
  values: {
    user: { name: 'John' },
    notifications: [5, 10, 15],
  },
});
// Returns: "Welcome John, you have 5 new messages"
```

### 4. **Request Abortion Support**

Cancel pending translation fetches:

```javascript
const controller = new AbortController();

const i18n = new I18n({
  defaultLocale: 'en',
  abortController: controller,
});

// Start loading
i18n.loadNamespaces('en', ['pages/dashboard']);

// Cancel if needed
controller.abort();
```

### 5. **Batch Translation**

Translate multiple keys in parallel:

```javascript
const translations = await i18n.batchTranslate([
  'common.save',
  'common.cancel',
  'common.delete',
]);

console.log(translations);
// {
//   'common.save': 'Save',
//   'common.cancel': 'Cancel',
//   'common.delete': 'Delete'
// }
```

### 6. **Translation Validation**

Validate translation coverage:

```javascript
const requiredKeys = [
  'common.save',
  'common.cancel',
  'pages/home.title',
];

const validation = await i18n.validateTranslations(requiredKeys, 'es');

console.log(validation);
// {
//   valid: true,
//   locale: 'es',
//   found: ['common.save', 'common.cancel', 'pages/home.title'],
//   missing: [],
//   coverage: 100
// }
```

### 7. **Export Translations**

Export loaded translations for backup or analysis:

```javascript
const json = i18n.exportTranslations('en');
console.log(json); // JSON string of all loaded translations

// Save to file or send to server
await fetch('/api/translations/backup', {
  method: 'POST',
  body: json,
});
```

### 8. **Translation Statistics**

Get detailed statistics about loaded translations:

```javascript
const stats = i18n.getStats();

console.log(stats);
// {
//   currentLocale: 'en',
//   supportedLocales: ['en', 'es', 'fr', 'de', 'ja', 'zh'],
//   loadedNamespaces: {
//     en: ['common', 'components/button', 'pages/home'],
//     es: ['common']
//   },
//   totalKeys: 150,
//   missingKeys: 2,
//   cacheSize: 4
// }
```

### 9. **Auto DOM Observation (MutationObserver)**

Automatically translate dynamically added elements:

```javascript
// Initialize with auto-observation
I18nDirective.init(document.body, { autoObserve: true });

// Add element dynamically - it will be automatically translated!
const newElement = document.createElement('div');
newElement.setAttribute('data-i18n', 'common.welcome');
document.body.appendChild(newElement);
// No manual translation needed!
```

### 10. **Enhanced Directive Attributes**

More powerful HTML directives:

```html
<!-- Pluralization in HTML -->
<p data-i18n="common.items" data-i18n-count="5">Items</p>

<!-- Default value -->
<h1 data-i18n="missing.key" data-i18n-default="Default Title">Title</h1>

<!-- Multiple targets -->
<img src="logo.png" data-i18n="logo.alt" data-i18n-target="alt,title" />

<!-- Value attribute -->
<input type="text" data-i18n="placeholder" data-i18n-target="placeholder,value" />
```

### 11. **New Helper Functions**

#### List Formatting
```javascript
import { formatList } from './src/i18n-helpers.js';

formatList(['Apple', 'Orange', 'Banana']);
// en: "Apple, Orange, and Banana"
// es: "Apple, Orange y Banana"
// fr: "Apple, Orange et Banana"

formatList(['Red', 'Blue'], { type: 'disjunction' });
// en: "Red or Blue"
```

#### Text Direction Support
```javascript
import { getTextDirection, applyTextDirection } from './src/i18n-helpers.js';

getTextDirection(); // 'ltr' or 'rtl'

// Automatically apply to <html> element
applyTextDirection();

// Apply to specific element
applyTextDirection(document.querySelector('.content'));
```

#### Translation Hook (for reactive patterns)
```javascript
import { useTranslation } from './src/i18n-helpers.js';

const translation = useTranslation('common.welcome', {
  values: { name: 'John' },
});

console.log(translation.value); // Current translation
translation.update(); // Manually refresh
translation.destroy(); // Cleanup
```

### 12. **Enhanced Language Switcher**

```javascript
import { LanguageSwitcher } from './src/i18n-helpers.js';

new LanguageSwitcher(document.getElementById('switcher'), {
  type: 'buttons',
  onChange: (newLocale) => {
    console.log('Language changed to:', newLocale);
    analytics.track('language_change', { locale: newLocale });
  },
});
```

## Performance Improvements

1. **WeakSet for Element Tracking**: Prevents memory leaks with dynamically created/destroyed elements
2. **Nested Maps**: More efficient cache structure
3. **Batch Operations**: `batchTranslate()` loads namespaces in parallel
4. **Abort Controllers**: Cancel unnecessary network requests
5. **Optimized Interpolation**: Better regex patterns for nested value resolution

## Breaking Changes

**None!** All changes are backward compatible. Existing code will continue to work without modifications.

## Migration Guide

### Before
```javascript
import { i18n } from './src/i18n.js';

await i18n.loadNamespaces('en', ['common']);
const text = await i18n.t('common.welcome');
```

### After (with new features)
```javascript
import { i18n } from './src/i18n.js';

// Enable debug mode for development
if (process.env.NODE_ENV === 'development') {
  i18n.debug = true;
}

await i18n.loadNamespaces('en', ['common']);

// Use default values
const text = await i18n.t('common.welcome', {
  defaultValue: 'Welcome!',
  values: { user: { name: 'John' } }, // Nested values
});

// Check for missing translations
const missing = i18n.getMissingTranslations();
if (missing.length > 0) {
  console.warn('Missing translations:', missing);
}

// Get statistics
const stats = i18n.getStats();
console.log(`Loaded ${stats.totalKeys} translation keys`);
```

## Examples

### Complete Setup with All New Features

```javascript
import { I18n } from './src/i18n.js';
import {
  I18nDirective,
  LanguageSwitcher,
  applyTextDirection,
  formatList,
} from './src/i18n-helpers.js';

// Create custom instance with all features
const i18n = new I18n({
  defaultLocale: 'en',
  fallbackLocale: 'en',
  supportedLocales: ['en', 'es', 'fr', 'ar'], // Including RTL
  debug: true,
  onMissingTranslation: (key, locale) => {
    // Track missing translations
    analytics.trackMissingTranslation(key, locale);
  },
});

// Load required translations
await i18n.loadNamespaces('en', ['common', 'components/button', 'pages/home']);

// Initialize directives with auto-observation
I18nDirective.init(document.body, { autoObserve: true });

// Setup language switcher with callback
new LanguageSwitcher(document.getElementById('lang-switcher'), {
  type: 'buttons',
  onChange: (locale) => {
    analytics.track('language_changed', { locale });
    applyTextDirection(); // Handle RTL/LTR
  },
});

// Validate translations for production
const validation = await i18n.validateTranslations(
  ['common.save', 'common.cancel', 'pages/home.title'],
  'es'
);

if (!validation.valid) {
  console.error('Missing translations:', validation.missing);
}

// Export statistics
console.log('i18n Stats:', i18n.getStats());

// Use advanced features
const items = ['Apple', 'Orange', 'Banana'];
const list = formatList(items); // Locale-aware list formatting

const message = await i18n.t('welcome.message', {
  values: {
    user: { name: 'John', role: 'Admin' },
    stats: { count: 5 },
  },
  defaultValue: 'Welcome!',
});
```

## Testing Utilities

```javascript
// Check translation coverage before deployment
async function checkTranslationCoverage(requiredKeys) {
  const locales = ['en', 'es', 'fr'];
  const results = {};

  for (const locale of locales) {
    results[locale] = await i18n.validateTranslations(requiredKeys, locale);
  }

  return results;
}

// Usage
const coverage = await checkTranslationCoverage([
  'common.save',
  'common.cancel',
  'pages/home.title',
]);

console.log(coverage);
// {
//   en: { valid: true, coverage: 100, missing: [] },
//   es: { valid: false, coverage: 66.7, missing: ['pages/home.title'] },
//   fr: { valid: true, coverage: 100, missing: [] }
// }
```

## Best Practices

1. **Enable Debug Mode in Development**
   ```javascript
   const i18n = new I18n({
     debug: process.env.NODE_ENV === 'development',
   });
   ```

2. **Track Missing Translations**
   ```javascript
   onMissingTranslation: (key, locale) => {
     errorTracker.log({ key, locale });
   }
   ```

3. **Validate Before Deploy**
   ```javascript
   // In CI/CD pipeline
   const validation = await i18n.validateTranslations(REQUIRED_KEYS);
   if (!validation.valid) {
     throw new Error('Missing translations');
   }
   ```

4. **Use Default Values for Graceful Degradation**
   ```javascript
   await i18n.t('new.feature.text', {
     defaultValue: 'Feature text',
   });
   ```

5. **Monitor Translation Stats**
   ```javascript
   setInterval(() => {
     const stats = i18n.getStats();
     metrics.gauge('i18n.missing_keys', stats.missingKeys);
   }, 60000);
   ```

## Future Enhancements

Potential future improvements (not yet implemented):

- Translation memory (suggest similar translations)
- Automatic locale detection from browser
- Translation caching with IndexedDB
- Hot module replacement for translations
- Translation editor UI
- Pluralization rule customization
- Gender support in translations
- Context-aware translations

## Support

For issues or questions about the i18n improvements, see:
- [I18N-README.md](I18N-README.md) - Complete API documentation
- [I18N-QUICK-START.md](I18N-QUICK-START.md) - Quick start guide
- [i18n-demo.html](i18n-demo.html) - Live examples
