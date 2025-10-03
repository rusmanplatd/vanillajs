# Internationalization (i18n) System

Comprehensive internationalization system for vanilla JavaScript applications with support for split
JSON files, reactive language switching, pluralization, and interpolation.

## Features

- **Split JSON Files**: Organize translations by language, components, pages, and nested folders
- **Reactive Updates**: Automatically update UI when language changes using RxJS
- **Pluralization**: Smart plural forms based on count
- **Interpolation**: Dynamic values in translations
- **Locale Persistence**: Remember user's language preference
- **Lazy Loading**: Load translations on-demand
- **Fallback System**: Graceful degradation when translations are missing
- **Type-Safe**: JSDoc annotations for better IDE support
- **Locale-Aware Formatting**: Date, number, currency, and relative time formatting

## Directory Structure

```
i18n/
├── en/                       # English translations
│   ├── common.json           # Common translations
│   ├── components/           # Component translations
│   │   ├── button.json
│   │   ├── navigation.json
│   │   └── form/            # Nested folders supported
│   │       └── input.json
│   └── pages/               # Page translations
│       └── home.json
├── es/                       # Spanish translations
│   └── ...                   # Same structure as en/
└── fr/                       # French translations
    └── ...                   # Same structure as en/
```

## Quick Start

### 1. Basic Setup

```javascript
import { i18n } from './src/i18n.js';
import { I18nDirective } from './src/i18n-helpers.js';

// Initialize with default configuration
i18n.setLocale('en');

// Load required namespaces
await i18n.loadNamespaces('en', ['common', 'components/button', 'pages/home']);

// Initialize DOM directives
I18nDirective.init();
```

### 2. HTML Usage

```html
<!-- Simple translation -->
<h1 data-i18n="pages/home.title">Default Title</h1>

<!-- With interpolation -->
<p data-i18n="pages/home.welcome" data-i18n-values='{"name":"John"}'>Welcome</p>

<!-- Different targets -->
<input type="text" data-i18n="pages/home.placeholder" data-i18n-target="placeholder" />
<img src="logo.png" data-i18n="pages/home.logoAlt" data-i18n-target="alt" />
```

### 3. JavaScript Usage

```javascript
// Async translation
const text = await i18n.t('pages/home.title');

// Sync translation (only if already loaded)
const text = i18n.tSync('pages/home.title');

// With interpolation
const welcome = await i18n.t('pages/home.welcome', {
  values: { name: 'John' },
});

// With pluralization
const items = await i18n.t('common.plurals.items', {
  count: 5,
});

// Override locale
const text = await i18n.t('pages/home.title', {
  locale: 'es',
});
```

## Configuration

### Custom Configuration

```javascript
import { I18n } from './src/i18n.js';

const i18n = new I18n({
  defaultLocale: 'en',
  fallbackLocale: 'en',
  translationsPath: '/locales',
  preload: true,
  supportedLocales: ['en', 'es', 'fr', 'de', 'ja', 'zh'],
});
```

### Translation Files

**Common translations** (`/i18n/en/common.json`):

```json
{
  "app": {
    "title": "My Application",
    "description": "Welcome to my app"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "messages": {
    "loading": "Loading...",
    "success": "Operation completed successfully"
  }
}
```

**Component translations** (`/i18n/en/components/button.json`):

```json
{
  "submit": "Submit",
  "cancel": "Cancel",
  "save": "Save Changes",
  "delete": "Delete Item"
}
```

**Page translations** (`/i18n/en/pages/home.json`):

```json
{
  "title": "Welcome to Our Application",
  "welcome": "Hello, {name}!",
  "description": "This is the home page"
}
```

## Translation Keys

### Key Format

Translation keys follow the format: `namespace.path`

- **Namespace**: The file path relative to the locale directory (e.g., `components/button`,
  `pages/home`)
- **Path**: Dot-notation path within the JSON file (e.g., `submit`, `app.title`)

**Examples:**

```javascript
// Load from /i18n/en/common.json -> app.title
await i18n.t('common.app.title');

// Load from /i18n/en/components/button.json -> submit
await i18n.t('components/button.submit');

// Load from /i18n/en/pages/home.json -> welcome
await i18n.t('pages/home.welcome');

// Nested paths
await i18n.t('common.messages.success');
```

## Pluralization

### Pipe Format (Simple)

```json
{
  "items": "no items|one item|{count} items"
}
```

Usage:

```javascript
await i18n.t('common.items', { count: 0 }); // "no items"
await i18n.t('common.items', { count: 1 }); // "one item"
await i18n.t('common.items', { count: 5 }); // "5 items"
```

### Object Format (Advanced)

```json
{
  "items": {
    "zero": "no items",
    "one": "one item",
    "other": "{count} items"
  }
}
```

## Interpolation

### Supported Formats

```javascript
// Curly braces: {key}
'Hello, {name}!';

// Double curly braces: {{key}}
'Hello, {{name}}!';

// Template literal style: ${key}
'Hello, ${name}!';
```

### Usage

```javascript
await i18n.t('message', {
  values: {
    name: 'John',
    age: 25,
  },
});
```

### Complex Example

```json
{
  "userStats": "User {name} has {count} item|User {name} has {count} items"
}
```

```javascript
await i18n.t('userStats', {
  count: 5,
  values: { name: 'John' },
});
// Result: "User John has 5 items"
```

## Language Switching

### Programmatic Switching

```javascript
// Set locale
await i18n.setLocale('es');

// Get current locale
const current = i18n.getCurrentLocale();

// Check supported locales
console.log(i18n.supportedLocales);
```

### Language Switcher Component

```javascript
import { LanguageSwitcher } from './src/i18n-helpers.js';

const container = document.getElementById('language-switcher');

// Dropdown style
new LanguageSwitcher(container, {
  type: 'dropdown',
  className: 'language-select',
});

// Button style
new LanguageSwitcher(container, {
  type: 'buttons',
  className: 'language-buttons',
});
```

### React to Locale Changes

```javascript
// Subscribe to locale changes
const subscription = i18n.locale$.subscribe((locale) => {
  console.log('Language changed to:', locale);
  // Update your UI
});

// Unsubscribe when done
subscription.unsubscribe();
```

## Locale-Aware Formatting

### Date Formatting

```javascript
import { formatDate } from './src/i18n-helpers.js';

// Short date
formatDate(new Date(), { dateStyle: 'short' });
// en: "1/15/25"
// es: "15/1/25"
// fr: "15/01/2025"

// Long date
formatDate(new Date(), { dateStyle: 'long' });
// en: "January 15, 2025"
// es: "15 de enero de 2025"
// fr: "15 janvier 2025"

// Date and time
formatDate(new Date(), {
  dateStyle: 'medium',
  timeStyle: 'short',
});
// en: "Jan 15, 2025, 3:30 PM"
```

### Number Formatting

```javascript
import { formatNumber } from './src/i18n-helpers.js';

formatNumber(1234567.89);
// en: "1,234,567.89"
// es: "1.234.567,89"
// fr: "1 234 567,89"

// Percentage
formatNumber(0.875, { style: 'percent' });
// en: "87.5%"
```

### Currency Formatting

```javascript
import { formatCurrency } from './src/i18n-helpers.js';

formatCurrency(1234.56, 'USD');
// en: "$1,234.56"
// es: "1234,56 US$"
// fr: "1 234,56 $US"

formatCurrency(1234.56, 'EUR');
// en: "€1,234.56"
// es: "1234,56 €"
// fr: "1 234,56 €"
```

### Relative Time

```javascript
import { formatRelativeTime } from './src/i18n-helpers.js';

const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

formatRelativeTime(twoHoursAgo);
// en: "2 hours ago"
// es: "hace 2 horas"
// fr: "il y a 2 heures"
```

## Advanced Features

### Check Translation Existence

```javascript
if (i18n.has('pages/home.title')) {
  console.log('Translation exists');
}
```

### Get Entire Namespace

```javascript
const allButtons = i18n.getNamespace('components/button');
console.log(allButtons);
// { submit: "Submit", cancel: "Cancel", ... }
```

### Clear Cache

```javascript
// Clear all translations
i18n.clearCache();

// Clear specific locale
i18n.clearLocale('es');
```

### Dynamic Element Creation

```javascript
import { createTranslatedElement } from './src/i18n-helpers.js';

const button = await createTranslatedElement('button', 'components/button.submit', {
  values: { name: 'John' },
  attributes: { class: 'btn btn-primary' },
});

document.body.appendChild(button);
```

## API Reference

### I18n Class

#### Constructor Options

```typescript
{
  defaultLocale: string;        // Default language (default: 'en')
  fallbackLocale: string;       // Fallback language (default: 'en')
  translationsPath: string;     // Base path for translations (default: '/i18n')
  preload: boolean;             // Preload all translations (default: false)
  supportedLocales: string[];   // List of supported locales
}
```

#### Methods

- `getCurrentLocale(): string` - Get current locale
- `setLocale(locale: string): Promise<void>` - Set current locale
- `loadTranslation(locale: string, namespace: string): Promise<Object>` - Load a translation file
- `loadNamespaces(locale: string, namespaces: string[]): Promise<void>` - Load multiple namespaces
- `t(key: string, params?: Object): Promise<string>` - Translate (async)
- `tSync(key: string, params?: Object): string` - Translate (sync)
- `has(key: string, locale?: string): boolean` - Check if translation exists
- `getNamespace(namespace: string, locale?: string): Object|null` - Get entire namespace
- `clearCache(): void` - Clear all cached translations
- `clearLocale(locale: string): void` - Clear cache for specific locale

### Helper Functions

- `formatDate(date, options)` - Format date with locale
- `formatNumber(number, options)` - Format number with locale
- `formatCurrency(amount, currency, options)` - Format currency
- `formatRelativeTime(date, options)` - Format relative time
- `getSupportedLocales()` - Get list of supported locales

## Best Practices

1. **Organize by Feature**: Split translations by components/pages for better maintainability
2. **Use Namespaces**: Keep related translations together in the same file
3. **Consistent Keys**: Use descriptive, hierarchical keys (e.g., `pages.home.features.title`)
4. **Preload Common**: Preload common translations on app init
5. **Lazy Load**: Load page-specific translations when needed
6. **Fallback Content**: Always provide fallback text in HTML
7. **Test All Locales**: Verify translations work in all supported languages

## Troubleshooting

### Translations Not Loading

- Check that the JSON file path is correct
- Verify the file is accessible (check network tab)
- Ensure the namespace matches the file path

### Translations Not Updating

- Make sure you're using `data-i18n` attributes
- Verify `I18nDirective.init()` was called
- Check that the translation was loaded for the current locale

### Missing Translations

- Check if the key exists in the JSON file
- Verify the fallback locale has the translation
- Use `i18n.has(key)` to check existence

## Examples

See [i18n-demo.html](i18n-demo.html) for a complete working example with:

- Language switcher
- Interpolation demo
- Pluralization demo
- Locale-aware formatting
- Dynamic content updates

## Browser Support

- Modern browsers with ES2021+ support
- Intl API support required for formatting features

## Dependencies

- RxJS (BehaviorSubject for reactive locale changes)

## License

MIT
