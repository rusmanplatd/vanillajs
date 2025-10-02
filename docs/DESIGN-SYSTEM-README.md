# Design System

A comprehensive, reactive design system built with CSS tokens and reactive JavaScript using RxJS Observables. Features dynamic theming, density controls, and a complete component library.

## Features

- ✅ **CSS Design Tokens** - Comprehensive token system for colors, typography, spacing, shadows
- ✅ **Reactive Theme Manager** - RxJS-based theme switching with observables
- ✅ **Multiple Themes** - Light, Dark, and High Contrast modes
- ✅ **Density Controls** - Default, Compact, and Comfortable spacing
- ✅ **Dynamic Scaling** - UI scale from 0.5x to 2.0x
- ✅ **Component Library** - Pre-built components using design tokens
- ✅ **Custom Token Overrides** - Runtime customization of any token
- ✅ **LocalStorage Persistence** - Save user preferences
- ✅ **System Preferences** - Respects dark mode and reduced motion
- ✅ **TypeScript-ready** - Full JSDoc annotations

## Quick Start

### 1. Import CSS

```html
<link rel="stylesheet" href="./src/design-system.css" />
<link rel="stylesheet" href="./src/ui-components.css" />
```

### 2. Use Theme Manager

```javascript
import { themeManager } from './src/theme-manager.js';

// Change theme
themeManager.setTheme('dark');

// Subscribe to theme changes
themeManager.theme$.subscribe((theme) => {
  console.log('Theme changed to:', theme);
});

// Set custom colors
themeManager.setToken('color-primary', '#ff0000');
```

### 3. Use Components

```html
<button class="btn btn-primary">Click Me</button>
<input type="text" class="input" placeholder="Enter text..." />
<div class="card">
  <h3 class="card-title">Card Title</h3>
  <div class="card-body">Card content here</div>
</div>
```

## Design Tokens

### Color System

#### Semantic Colors

```css
--color-primary;        /* Primary brand color */
--color-secondary;      /* Secondary brand color */
--color-success;        /* Success state */
--color-warning;        /* Warning state */
--color-error;          /* Error state */
--color-background;     /* Page background */
--color-surface;        /* Component background */
--color-on-primary;     /* Text on primary color */
--color-on-surface;     /* Text on surface */
```

#### Color Scales

Each color has a full scale from 50 (lightest) to 900 (darkest):

```css
--color-primary-50;
--color-primary-100;
/* ... */
--color-primary-900;
```

Available scales: `primary`, `secondary`, `success`, `warning`, `error`, `neutral`

### Typography

#### Font Families

```css
--font-family-base;     /* -apple-system, BlinkMacSystemFont, ... */
--font-family-heading;  /* Same as base */
--font-family-mono;     /* Monaco, Courier New, ... */
```

#### Font Sizes

```css
--font-size-xs;    /* 12px */
--font-size-sm;    /* 14px */
--font-size-base;  /* 16px */
--font-size-lg;    /* 18px */
--font-size-xl;    /* 20px */
--font-size-2xl;   /* 24px */
--font-size-3xl;   /* 30px */
--font-size-4xl;   /* 36px */
--font-size-5xl;   /* 48px */
--font-size-6xl;   /* 60px */
```

#### Font Weights

```css
--font-weight-light;     /* 300 */
--font-weight-normal;    /* 400 */
--font-weight-medium;    /* 500 */
--font-weight-semibold;  /* 600 */
--font-weight-bold;      /* 700 */
```

### Spacing Scale

```css
--spacing-0;   /* 0 */
--spacing-1;   /* 4px */
--spacing-2;   /* 8px */
--spacing-3;   /* 12px */
--spacing-4;   /* 16px */
--spacing-5;   /* 20px */
--spacing-6;   /* 24px */
--spacing-8;   /* 32px */
--spacing-10;  /* 40px */
--spacing-12;  /* 48px */
--spacing-16;  /* 64px */
--spacing-20;  /* 80px */
--spacing-24;  /* 96px */
```

### Border Radius

```css
--radius-none;  /* 0 */
--radius-sm;    /* 4px */
--radius-base;  /* 8px */
--radius-md;    /* 12px */
--radius-lg;    /* 16px */
--radius-xl;    /* 24px */
--radius-full;  /* 9999px */
```

### Shadows

```css
--shadow-xs;    /* Subtle shadow */
--shadow-sm;    /* Small shadow */
--shadow-base;  /* Default shadow */
--shadow-md;    /* Medium shadow */
--shadow-lg;    /* Large shadow */
--shadow-xl;    /* Extra large shadow */
```

### Transitions

```css
--transition-fast;  /* 150ms cubic-bezier(0.4, 0, 0.2, 1) */
--transition-base;  /* 300ms cubic-bezier(0.4, 0, 0.2, 1) */
--transition-slow;  /* 500ms cubic-bezier(0.4, 0, 0.2, 1) */
```

## Theme Manager API

### Constructor

```javascript
import { ThemeManager } from './src/theme-manager.js';

const themeManager = new ThemeManager({
  defaultTheme: 'light',
  defaultDensity: 'default',
  persistToLocalStorage: true,
  storageKey: 'design-system-config',
});
```

### Methods

#### `setTheme(themeName)`

Set the current theme.

```javascript
themeManager.setTheme('dark');
themeManager.setTheme('light');
themeManager.setTheme('high-contrast');
```

#### `setDensity(density)`

Set UI density.

```javascript
themeManager.setDensity('default');
themeManager.setDensity('compact');
themeManager.setDensity('comfortable');
```

#### `setScale(scale)`

Set UI scale factor (0.5 to 2.0).

```javascript
themeManager.setScale(1.2); // 120% size
```

#### `toggleTheme()`

Toggle between light and dark.

```javascript
themeManager.toggleTheme();
```

#### `setToken(tokenName, value)`

Set a custom token value.

```javascript
themeManager.setToken('color-primary', '#ff0000');
themeManager.setToken('spacing-4', '20px');
```

#### `setTokens(tokens)`

Set multiple tokens at once.

```javascript
themeManager.setTokens({
  'color-primary': '#ff0000',
  'color-secondary': '#00ff00',
  'spacing-base': '20px',
});
```

#### `getToken(tokenName)`

Get a token value.

```javascript
const primary = themeManager.getToken('color-primary');
```

#### `getAllTokens()`

Get all token values.

```javascript
const tokens = themeManager.getAllTokens();
console.log(tokens);
```

#### `reset()`

Reset to defaults.

```javascript
themeManager.reset();
```

#### `exportConfig()`

Export current configuration.

```javascript
const config = themeManager.exportConfig();
localStorage.setItem('my-theme', JSON.stringify(config));
```

#### `importConfig(config)`

Import configuration.

```javascript
const config = JSON.parse(localStorage.getItem('my-theme'));
themeManager.importConfig(config);
```

### Observables

Subscribe to reactive changes:

```javascript
// Theme changes
themeManager.theme$.subscribe((theme) => {
  console.log('Theme:', theme);
});

// Density changes
themeManager.density$.subscribe((density) => {
  console.log('Density:', density);
});

// Scale changes
themeManager.scale$.subscribe((scale) => {
  console.log('Scale:', scale);
});

// System dark mode preference
themeManager.darkMode$.subscribe((isDark) => {
  console.log('System prefers dark mode:', isDark);
});

// Reduced motion preference
themeManager.reducedMotion$.subscribe((isReduced) => {
  console.log('Reduced motion:', isReduced);
});

// Combined config
themeManager.config$.subscribe((config) => {
  console.log('Config:', config);
});
```

## Component Library

### Buttons

```html
<!-- Variants -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-error">Error</button>
<button class="btn btn-outlined">Outlined</button>
<button class="btn btn-text">Text</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Medium</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Disabled -->
<button class="btn btn-primary" disabled>Disabled</button>
```

### Form Elements

```html
<!-- Text Input -->
<input type="text" class="input" placeholder="Enter text..." />
<input type="text" class="input input-sm" placeholder="Small" />
<input type="text" class="input input-lg" placeholder="Large" />

<!-- Textarea -->
<textarea class="input textarea" placeholder="Enter message..."></textarea>

<!-- Select -->
<select class="input">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Toggle Switch -->
<label class="switch">
  <input type="checkbox" />
  <span class="switch-slider"></span>
</label>
```

### Cards

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content goes here.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Badges

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
```

### Chips

```html
<span class="chip">Tag</span>
<span class="chip chip-removable">
  Removable
  <button class="chip-remove">×</button>
</span>
```

### Alerts

```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-error">Error message</div>
<div class="alert alert-info">Info message</div>
```

### Progress Bars

```html
<div class="progress">
  <div class="progress-bar" style="width: 75%"></div>
</div>

<div class="progress">
  <div class="progress-bar progress-bar-success" style="width: 100%"></div>
</div>
```

### Skeleton Loaders

```html
<!-- Text skeleton -->
<div class="skeleton skeleton-text"></div>

<!-- Block skeleton -->
<div class="skeleton" style="height: 200px"></div>

<!-- Circle skeleton -->
<div class="skeleton skeleton-circle" style="width: 60px; height: 60px"></div>
```

## Utility Classes

### Spacing

```html
<!-- Margin -->
<div class="mt-4">Margin top</div>
<div class="mb-6">Margin bottom</div>

<!-- Padding -->
<div class="p-4">Padding all sides</div>
<div class="p-6">More padding</div>
```

### Flexbox

```html
<div class="flex items-center justify-between gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div class="flex flex-col gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Grid

```html
<div class="grid grid-cols-3 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

<!-- Responsive grid -->
<div class="grid-responsive">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Text Alignment

```html
<div class="text-center">Centered</div>
<div class="text-left">Left</div>
<div class="text-right">Right</div>
```

## Live Demo

Run the interactive demo to explore all features:

```bash
npm start
# Then open design-system-demo.html
```

The demo includes:

- Theme switcher (Light, Dark, High Contrast)
- Density controls (Default, Compact, Comfortable)
- UI scale slider
- Custom color pickers
- Complete component showcase
- Token inspector
- Export/import configuration

## Real-World Examples

### Custom Branding

```javascript
import { themeManager } from './src/theme-manager.js';

// Apply custom brand colors
themeManager.setTokens({
  'color-primary-500': 'rgb(255, 0, 0)',
  'color-primary': 'rgb(255, 0, 0)',
  'color-secondary-500': 'rgb(0, 0, 255)',
  'color-secondary': 'rgb(0, 0, 255)',
});
```

### Responsive Theme Based on Screen Size

```javascript
import { breakpointObserver, Breakpoints } from './src/breakpoint-observer.js';
import { themeManager } from './src/theme-manager.js';

breakpointObserver.observe(Breakpoints.Handset).subscribe((state) => {
  if (state.matches) {
    themeManager.setDensity('compact');
  } else {
    themeManager.setDensity('default');
  }
});
```

### Dark Mode Based on Time

```javascript
const hour = new Date().getHours();
if (hour >= 18 || hour < 6) {
  themeManager.setTheme('dark');
} else {
  themeManager.setTheme('light');
}
```

### Accessibility Features

```javascript
// Respect system preferences
themeManager.darkMode$.subscribe((prefersDark) => {
  if (prefersDark) {
    themeManager.setTheme('dark');
  }
});

themeManager.reducedMotion$.subscribe((prefersReduced) => {
  if (prefersReduced) {
    console.log('Animations disabled for accessibility');
  }
});
```

### Multi-Tenant Theming

```javascript
const tenantThemes = {
  acme: {
    'color-primary': '#ff6b6b',
    'color-secondary': '#4ecdc4',
  },
  globex: {
    'color-primary': '#667eea',
    'color-secondary': '#764ba2',
  },
};

const tenant = 'acme';
themeManager.setTokens(tenantThemes[tenant]);
```

## Browser Support

- Modern browsers with ES2021+ support
- CSS Custom Properties (CSS Variables)
- LocalStorage API
- `matchMedia` for system preferences

## Best Practices

1. **Use Semantic Tokens**: Prefer `--color-primary` over `--color-blue-500`
2. **Consistent Spacing**: Use the spacing scale instead of arbitrary values
3. **Component Composition**: Build complex components from simple utilities
4. **Theme Testing**: Test all themes to ensure proper contrast
5. **Accessibility**: Always test with reduced motion and high contrast

## File Structure

```
src/
├── design-system.css      # CSS tokens and theme variables
├── ui-components.css      # Component styles
├── theme-manager.js       # Reactive theme manager
├── design-system-demo.js  # Demo application

design-system-demo.html    # Interactive demo page
```

## Comparison with Popular Frameworks

| Feature                | Material UI | Chakra UI | This System |
| ---------------------- | ----------- | --------- | ----------- |
| CSS Tokens             | ✅          | ✅        | ✅          |
| Reactive Theming       | ✅          | ✅        | ✅          |
| Runtime Customization  | ✅          | ✅        | ✅          |
| No Framework Required  | ❌          | ❌        | ✅          |
| RxJS Observables       | ❌          | ❌        | ✅          |
| File Size (unminified) | ~150KB      | ~100KB    | ~15KB       |
| Component Library      | ✅          | ✅        | ✅          |
| TypeScript Support     | ✅          | ✅        | ✅ (JSDoc)  |
| LocalStorage Persist   | ❌          | ✅        | ✅          |

## License

ISC
