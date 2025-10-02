# i18n Quick Start Guide

## 5-Minute Setup

### 1. Create Translation Files

Create your translation structure:

```
i18n/
├── en/
│   ├── common.json
│   └── components/
│       └── button.json
└── es/
    ├── common.json
    └── components/
        └── button.json
```

**`i18n/en/common.json`:**

```json
{
  "welcome": "Welcome, {name}!",
  "items": "no items|one item|{count} items"
}
```

### 2. Add to HTML

```html
<!doctype html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div id="app">
      <!-- Simple translation -->
      <h1 data-i18n="common.welcome" data-i18n-values='{"name":"User"}'>Welcome</h1>

      <!-- Language switcher -->
      <div id="lang-switcher"></div>
    </div>

    <script type="module" src="./app.js"></script>
  </body>
</html>
```

### 3. Initialize in JavaScript

**`app.js`:**

```javascript
import { i18n } from './src/i18n.js';
import { I18nDirective, LanguageSwitcher } from './src/i18n-helpers.js';

// Load translations
await i18n.loadNamespaces('en', ['common', 'components/button']);

// Initialize directives
I18nDirective.init();

// Add language switcher
new LanguageSwitcher(document.getElementById('lang-switcher'), {
  type: 'buttons',
});
```

That's it! Your app now supports multiple languages.

## Common Recipes

### Change Language

```javascript
await i18n.setLocale('es');
```

### Translate in Code

```javascript
const text = await i18n.t('common.welcome', {
  values: { name: 'John' },
});
```

### Pluralization

```javascript
const msg = await i18n.t('common.items', { count: 5 });
// Result: "5 items"
```

### Format Currency

```javascript
import { formatCurrency } from './src/i18n-helpers.js';

formatCurrency(1234.56, 'USD');
// en: "$1,234.56"
// es: "1234,56 US$"
```

### React to Language Change

```javascript
i18n.locale$.subscribe((locale) => {
  console.log('Language changed to:', locale);
});
```

## File Organization

Organize by feature:

```
i18n/
├── en/
│   ├── common.json              # Shared translations
│   ├── components/              # Component translations
│   │   ├── button.json
│   │   ├── navigation.json
│   │   └── form/               # Nested folders OK
│   │       ├── input.json
│   │       └── select.json
│   └── pages/                  # Page-specific translations
│       ├── home.json
│       └── dashboard/
│           ├── overview.json
│           └── settings.json
```

## Translation Key Format

Keys use namespace + path:

```javascript
// File: i18n/en/components/button.json
// Content: { "submit": "Submit" }
await i18n.t('components/button.submit');

// File: i18n/en/pages/home.json
// Content: { "hero": { "title": "Welcome" } }
await i18n.t('pages/home.hero.title');
```

## Supported Languages

Default configuration includes:

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Japanese (ja)
- Chinese (zh)

Add more in `i18n` initialization.

## Demo

See [i18n-demo.html](i18n-demo.html) for a complete working example.

## Full Documentation

See [I18N-README.md](I18N-README.md) for complete API documentation.
