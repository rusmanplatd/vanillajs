# Design Tokens Reference

Complete reference for all CSS design tokens in the system.

## Table of Contents

- [Colors](#colors)
- [Typography](#typography)
- [Spacing](#spacing)
- [Borders](#borders)
- [Shadows](#shadows)
- [Layout](#layout)
- [Transitions](#transitions)
- [Opacity](#opacity)
- [Z-Index](#z-index)
- [Component Tokens](#component-tokens)

---

## Colors

### Color Scales

Each color has a full scale from 50 (lightest) to 900 (darkest):

#### Primary Colors

```css
--color-primary-50: #e3f2fd;
--color-primary-100: #bbdefb;
--color-primary-200: #90caf9;
--color-primary-300: #64b5f6;
--color-primary-400: #42a5f5;
--color-primary-500: #2196f3; /* Base */
--color-primary-600: #1e88e5;
--color-primary-700: #1976d2;
--color-primary-800: #1565c0;
--color-primary-900: #0d47a1;
```

#### Secondary Colors

```css
--color-secondary-50 through --color-secondary-900
```

#### Success Colors

```css
--color-success-50 through --color-success-900
```

#### Warning Colors

```css
--color-warning-50 through --color-warning-900
```

#### Error Colors

```css
--color-error-50 through --color-error-900
```

#### Neutral/Gray Colors

```css
--color-neutral-50 through --color-neutral-900
```

### Semantic Colors

Theme-aware colors that change based on light/dark mode:

```css
--color-background        /* Page background */
--color-surface           /* Component backgrounds */
--color-surface-variant   /* Alternative surface */
--color-on-background     /* Text on background */
--color-on-surface        /* Text on surface */
--color-border            /* Border color */
--color-divider           /* Divider lines */
```

### Interactive Colors

```css
--color-primary           /* Primary brand color */
--color-on-primary        /* Text on primary */
--color-secondary         /* Secondary brand color */
--color-on-secondary      /* Text on secondary */
--color-success           /* Success states */
--color-on-success        /* Text on success */
--color-warning           /* Warning states */
--color-on-warning        /* Text on warning */
--color-error             /* Error states */
--color-on-error          /* Text on error */
```

**Usage:**

```css
.my-button {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}
```

---

## Typography

### Font Families

```css
--font-family-base      /* System sans-serif */
--font-family-heading   /* Same as base */
--font-family-mono      /* Monospace */
--font-family-serif     /* Serif fonts */
```

### Font Sizes

```css
--font-size-2xs: 0.625rem; /* 10px */
--font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
--font-size-2xl: 1.5rem; /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
--font-size-4xl: 2.25rem; /* 36px */
--font-size-5xl: 3rem; /* 48px */
--font-size-6xl: 3.75rem; /* 60px */
--font-size-7xl: 4.5rem; /* 72px */
--font-size-8xl: 6rem; /* 96px */
--font-size-9xl: 8rem; /* 128px */
```

### Font Weights

```css
--font-weight-thin: 100;
--font-weight-extralight: 200;
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--font-weight-black: 900;
```

### Line Heights

```css
--line-height-none: 1;
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose: 2;
```

### Letter Spacing

```css
--letter-spacing-tighter: -0.05em;
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
--letter-spacing-widest: 0.1em;
```

### Text Decoration

```css
--text-decoration-none: none;
--text-decoration-underline: underline;
--text-decoration-line-through: line-through;
```

**Usage:**

```css
h1 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.body-text {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}
```

---

## Spacing

### Base Spacing Scale

```css
--spacing-0: 0;
--spacing-1: 0.25rem; /* 4px */
--spacing-2: 0.5rem; /* 8px */
--spacing-3: 0.75rem; /* 12px */
--spacing-4: 1rem; /* 16px */
--spacing-5: 1.25rem; /* 20px */
--spacing-6: 1.5rem; /* 24px */
--spacing-8: 2rem; /* 32px */
--spacing-10: 2.5rem; /* 40px */
--spacing-12: 3rem; /* 48px */
--spacing-16: 4rem; /* 64px */
--spacing-20: 5rem; /* 80px */
--spacing-24: 6rem; /* 96px */
--spacing-32: 8rem; /* 128px */
--spacing-40: 10rem; /* 160px */
--spacing-48: 12rem; /* 192px */
```

### Margin Tokens

```css
--margin-0 through --margin-16
--margin-auto: auto;
```

### Padding Tokens

```css
--padding-0 through --padding-16
```

### Gap Tokens (Flexbox/Grid)

```css
--gap-0 through --gap-12
```

**Usage:**

```css
.container {
  padding: var(--padding-6);
  margin-bottom: var(--margin-8);
}

.grid {
  display: grid;
  gap: var(--gap-4);
}

.flex {
  display: flex;
  gap: var(--gap-2);
}
```

---

## Borders

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem; /* 4px */
--radius-base: 0.5rem; /* 8px */
--radius-md: 0.75rem; /* 12px */
--radius-lg: 1rem; /* 16px */
--radius-xl: 1.5rem; /* 24px */
--radius-2xl: 2rem; /* 32px */
--radius-3xl: 3rem; /* 48px */
--radius-full: 9999px; /* Fully rounded */
```

### Border Width

```css
--border-width-0: 0;
--border-width-1: 1px;
--border-width-2: 2px;
--border-width-4: 4px;
--border-width-8: 8px;
```

### Border Style

```css
--border-style-solid: solid;
--border-style-dashed: dashed;
--border-style-dotted: dotted;
--border-style-double: double;
--border-style-none: none;
```

### Combined Border Tokens

```css
--border-none: none;
--border-thin: 1px solid var(--color-border);
--border-medium: 2px solid var(--color-border);
--border-thick: 4px solid var(--color-border);
--border-dashed: 1px dashed var(--color-border);
--border-dotted: 1px dotted var(--color-border);
```

**Usage:**

```css
.card {
  border: var(--border-thin);
  border-radius: var(--radius-lg);
}

.button {
  border: var(--border-medium);
  border-radius: var(--radius-base);
}

.badge {
  border-radius: var(--radius-full);
}
```

---

## Shadows

```css
--shadow-xs: /* Subtle shadow */ --shadow-sm: /* Small shadow */
  --shadow-base: /* Default shadow */ --shadow-md: /* Medium shadow */
  --shadow-lg: /* Large shadow */ --shadow-xl: /* Extra large shadow */;
```

**Usage:**

```css
.card {
  box-shadow: var(--shadow-base);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.modal {
  box-shadow: var(--shadow-xl);
}
```

---

## Layout

### Widths

```css
--width-xs: 20rem; /* 320px */
--width-sm: 24rem; /* 384px */
--width-md: 28rem; /* 448px */
--width-lg: 32rem; /* 512px */
--width-xl: 36rem; /* 576px */
--width-2xl: 42rem; /* 672px */
--width-3xl: 48rem; /* 768px */
--width-4xl: 56rem; /* 896px */
--width-5xl: 64rem; /* 1024px */
--width-6xl: 72rem; /* 1152px */
--width-7xl: 80rem; /* 1280px */
--width-full: 100%;
--width-screen: 100vw;
--width-min: min-content;
--width-max: max-content;
--width-fit: fit-content;
```

### Max Widths

```css
--max-width-xs through --max-width-7xl
--max-width-full: 100%;
--max-width-screen: 100vw;
--max-width-prose: 65ch;  /* Optimal reading width */
```

### Heights

```css
--height-full: 100%;
--height-screen: 100vh;
--height-min: min-content;
--height-max: max-content;
--height-fit: fit-content;
```

### Min Heights

```css
--min-height-0: 0;
--min-height-full: 100%;
--min-height-screen: 100vh;
```

### Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

**Usage:**

```css
.modal {
  width: var(--width-lg);
  max-width: var(--max-width-2xl);
  min-height: var(--min-height-screen);
}

.prose {
  max-width: var(--max-width-prose);
}

.container {
  max-width: var(--container-xl);
  margin: 0 auto;
}
```

---

## Transitions

### Duration

```css
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;
```

### Easing Functions

```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Predefined Transitions

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

**Usage:**

```css
.button {
  transition: all var(--transition-fast);
}

.modal {
  transition: opacity var(--duration-300) var(--ease-in-out);
}

.bounce {
  transition: transform var(--duration-500) var(--ease-bounce);
}
```

---

## Opacity

```css
--opacity-0: 0;
--opacity-5: 0.05;
--opacity-10: 0.1;
--opacity-20: 0.2;
--opacity-25: 0.25;
--opacity-30: 0.3;
--opacity-40: 0.4;
--opacity-50: 0.5;
--opacity-60: 0.6;
--opacity-70: 0.7;
--opacity-75: 0.75;
--opacity-80: 0.8;
--opacity-90: 0.9;
--opacity-95: 0.95;
--opacity-100: 1;
```

**Usage:**

```css
.overlay {
  background-color: black;
  opacity: var(--opacity-50);
}

.disabled {
  opacity: var(--opacity-40);
}
```

---

## Z-Index

```css
--z-index-base: 0;
--z-index-dropdown: 1000;
--z-index-sticky: 1020;
--z-index-fixed: 1030;
--z-index-modal-backdrop: 1040;
--z-index-modal: 1050;
--z-index-popover: 1060;
--z-index-tooltip: 1070;
```

**Usage:**

```css
.dropdown {
  z-index: var(--z-index-dropdown);
}

.modal {
  z-index: var(--z-index-modal);
}

.tooltip {
  z-index: var(--z-index-tooltip);
}
```

---

## Component Tokens

### Buttons

```css
--button-height-sm: 2rem;
--button-height-md: 2.5rem;
--button-height-lg: 3rem;
--button-height-xl: 3.5rem;

--button-padding-x-sm: var(--padding-3);
--button-padding-x-md: var(--padding-4);
--button-padding-x-lg: var(--padding-6);
--button-padding-x-xl: var(--padding-8);

--button-padding-y-sm: var(--padding-2);
--button-padding-y-md: var(--padding-3);
--button-padding-y-lg: var(--padding-4);
--button-padding-y-xl: var(--padding-5);

--button-border-radius: var(--radius-base);
--button-font-weight: var(--font-weight-medium);
```

### Inputs

```css
--input-height-sm: 2rem;
--input-height-md: 2.5rem;
--input-height-lg: 3rem;
--input-height-xl: 3.5rem;

--input-padding-x-sm: var(--padding-2);
--input-padding-x-md: var(--padding-3);
--input-padding-x-lg: var(--padding-4);
--input-padding-x-xl: var(--padding-5);

--input-border-width: var(--border-width-2);
--input-border-radius: var(--radius-base);
--input-font-size: var(--font-size-base);
```

### Cards

```css
--card-padding-sm: var(--padding-4);
--card-padding-md: var(--padding-6);
--card-padding-lg: var(--padding-8);
--card-padding-xl: var(--padding-12);
--card-padding: var(--card-padding-md); /* Default */

--card-radius: var(--radius-lg);
--card-shadow: var(--shadow-base);
--card-border: var(--border-thin);
```

### Badges

```css
--badge-padding-x: var(--padding-3);
--badge-padding-y: var(--padding-1);
--badge-font-size: var(--font-size-sm);
--badge-font-weight: var(--font-weight-medium);
--badge-border-radius: var(--radius-full);
```

### Chips

```css
--chip-padding-x: var(--padding-3);
--chip-padding-y: var(--padding-2);
--chip-font-size: var(--font-size-sm);
--chip-border-radius: var(--radius-full);
```

### Alerts

```css
--alert-padding: var(--padding-4);
--alert-border-radius: var(--radius-base);
--alert-border-width: var(--border-width-1);
```

### Modals

```css
--modal-padding: var(--padding-6);
--modal-border-radius: var(--radius-lg);
--modal-max-width: var(--max-width-2xl);
```

### Tooltips

```css
--tooltip-padding-x: var(--padding-3);
--tooltip-padding-y: var(--padding-2);
--tooltip-font-size: var(--font-size-sm);
--tooltip-border-radius: var(--radius-base);
--tooltip-max-width: var(--max-width-xs);
```

---

## Density Variations

All component tokens automatically adjust based on the `data-density` attribute:

### Compact Density (`[data-density="compact"]`)

- Reduced spacing (75% of default)
- Smaller component heights
- Tighter paddings

### Comfortable Density (`[data-density="comfortable"]`)

- Increased spacing (125% of default)
- Larger component heights
- More generous paddings

**Usage:**

```javascript
import { themeManager } from './src/theme-manager.js';

// Set density
themeManager.setDensity('compact'); // Mobile-friendly
themeManager.setDensity('comfortable'); // Touch-friendly
themeManager.setDensity('default'); // Standard
```

---

## Best Practices

### 1. Use Semantic Tokens

```css
/* Good */
background-color: var(--color-surface);
color: var(--color-on-surface);

/* Avoid */
background-color: var(--color-neutral-100);
color: var(--color-neutral-900);
```

### 2. Use Spacing Scale

```css
/* Good */
padding: var(--padding-4);
margin-bottom: var(--margin-6);

/* Avoid */
padding: 16px;
margin-bottom: 24px;
```

### 3. Use Component Tokens

```css
/* Good */
.my-button {
  height: var(--button-height-md);
  padding: 0 var(--button-padding-x-md);
}

/* Avoid */
.my-button {
  height: 2.5rem;
  padding: 0 1rem;
}
```

### 4. Compose from Base Tokens

```css
/* Good - creates consistent custom component */
.my-card {
  padding: var(--padding-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-base);
  background: var(--color-surface);
}
```

### 5. Respect Theme Modes

All tokens automatically adapt to:

- Light/Dark/High Contrast themes
- Compact/Default/Comfortable density
- User accessibility preferences

---

## Token Customization

Override any token at runtime:

```javascript
import { themeManager } from './src/theme-manager.js';

// Custom brand colors
themeManager.setToken('color-primary-500', 'rgb(255, 0, 0)');
themeManager.setToken('color-primary', 'rgb(255, 0, 0)');

// Custom spacing
themeManager.setToken('spacing-4', '20px');

// Component customization
themeManager.setToken('button-border-radius', '20px');
```

---

## Complete Token Count

- **Colors**: 60+ tokens (6 scales × 10 shades each)
- **Typography**: 40+ tokens
- **Spacing**: 30+ tokens
- **Borders**: 20+ tokens
- **Layout**: 50+ tokens
- **Shadows**: 6 tokens
- **Transitions**: 15+ tokens
- **Opacity**: 15 tokens
- **Z-Index**: 8 tokens
- **Component Tokens**: 50+ tokens

**Total: 300+ design tokens**
