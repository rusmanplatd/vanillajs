# Project Summary

This repository contains two major systems built with vanilla JavaScript, RxJS, and modern web standards.

## 🎯 Systems Overview

### 1. BreakpointObserver System

**Location**: `src/breakpoint-observer.js`, `breakpoint-example.html`

A responsive layout detection utility inspired by Angular CDK's BreakpointObserver.

**Key Features**:
- Observable-based media query detection
- Predefined breakpoints (XSmall, Small, Medium, Large, XLarge)
- Device type detection (Handset, Tablet, Web)
- Orientation support (Portrait/Landscape)
- Multiple query observation
- Clean, reactive API

**Files**:
- `src/breakpoint-observer.js` - Core implementation (8KB)
- `src/breakpoint-example.js` - Demo application
- `breakpoint-example.html` - Interactive demo
- `BREAKPOINT-README.md` - Full documentation

**Demo**: Open `breakpoint-example.html` to see real-time breakpoint detection

---

### 2. Design System

**Location**: `src/design-system.css`, `src/theme-manager.js`, `design-system-demo.html`

A comprehensive, reactive design system with CSS tokens and dynamic theming.

**Key Features**:
- Complete CSS design token system
- Reactive theme manager with RxJS observables
- Multiple themes (Light, Dark, High Contrast)
- Density controls (Default, Compact, Comfortable)
- Dynamic UI scaling (0.5x to 2.0x)
- Full component library
- Runtime token customization
- LocalStorage persistence
- System preference detection

**Files**:
- `src/design-system.css` - CSS tokens and variables (8KB)
- `src/ui-components.css` - Component library (11KB)
- `src/theme-manager.js` - Reactive theme manager (13KB)
- `src/design-system-demo.js` - Demo application (6KB)
- `design-system-demo.html` - Interactive demo (18KB)
- `DESIGN-SYSTEM-README.md` - Full documentation
- `DESIGN-SYSTEM-QUICK-START.md` - Quick start guide

**Demo**: Open `design-system-demo.html` to explore all features

---

## 📚 Existing Systems

### 3. HTTP Client

**Location**: `src/http-client.js`

Angular-style HTTP client with RxJS Observables.

**Features**: Request/response interceptors, progress tracking, HttpParams, HttpHeaders, HttpContext

**Documentation**: `README.md`

---

### 4. Reactive Forms

**Location**: `src/forms.js`

Angular-inspired reactive forms system.

**Features**: FormControl, FormGroup, FormArray, Validators, RxJS-based validation

**Documentation**: `FORMS-README.md`

---

## 🚀 Quick Start

### Run All Demos

```bash
npm start
```

Then open:
- `index.html` - HTTP Client basic demo
- `index-advanced.html` - HTTP Client advanced demo
- `forms-example.html` - Forms basic demo
- `forms-advanced-example.html` - Forms advanced demo
- `breakpoint-example.html` - **BreakpointObserver demo** ⭐ NEW
- `design-system-demo.html` - **Design System demo** ⭐ NEW

### Development Commands

```bash
npm run dev           # Start dev server (no auto-open)
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
npm run docs          # Generate JSDoc documentation
npm run docs:watch    # Auto-regenerate docs on change
```

---

## 📦 Project Structure

```
vanillajs/
├── src/
│   ├── http-client.js              # HTTP client implementation
│   ├── forms.js                    # Reactive forms system
│   ├── breakpoint-observer.js      # ⭐ Breakpoint detection (NEW)
│   ├── breakpoint-example.js       # ⭐ Breakpoint demo (NEW)
│   ├── design-system.css           # ⭐ CSS tokens (NEW)
│   ├── ui-components.css           # ⭐ Component library (NEW)
│   ├── theme-manager.js            # ⭐ Reactive theming (NEW)
│   ├── design-system-demo.js       # ⭐ Design system demo (NEW)
│   ├── example.js                  # HTTP client examples
│   └── example-advanced.js         # Advanced HTTP examples
│
├── packages/
│   └── rxjs/                       # RxJS library (bundled)
│
├── Demo Pages
│   ├── index.html                  # HTTP client basic
│   ├── index-advanced.html         # HTTP client advanced
│   ├── forms-example.html          # Forms basic
│   ├── forms-advanced-example.html # Forms advanced
│   ├── breakpoint-example.html     # ⭐ Breakpoints (NEW)
│   └── design-system-demo.html     # ⭐ Design system (NEW)
│
├── Documentation
│   ├── README.md                   # HTTP client docs
│   ├── FORMS-README.md             # Forms docs
│   ├── BREAKPOINT-README.md        # ⭐ Breakpoint docs (NEW)
│   ├── DESIGN-SYSTEM-README.md     # ⭐ Design system docs (NEW)
│   ├── DESIGN-SYSTEM-QUICK-START.md # ⭐ Quick start (NEW)
│   ├── CLAUDE.md                   # AI assistant instructions
│   └── PROJECT-SUMMARY.md          # This file
│
└── Configuration
    ├── package.json                # npm configuration
    ├── .eslintrc.json             # ESLint config
    ├── .prettierrc.json           # Prettier config
    ├── jsdoc.json                 # JSDoc config
    └── .editorconfig              # Editor config
```

---

## 🎨 Design System Highlights

### CSS Design Tokens

Complete token system including:
- **Colors**: Primary, Secondary, Success, Warning, Error (50-900 scales)
- **Typography**: Font families, sizes (xs-6xl), weights, line heights
- **Spacing**: 13-point scale (0-24)
- **Border Radius**: 7 sizes (none to full)
- **Shadows**: 6 elevation levels
- **Transitions**: Fast, Base, Slow

### Component Library

Pre-built components:
- **Buttons**: 7 variants, 3 sizes
- **Form Elements**: Inputs, selects, textareas, switches
- **Cards**: Header, body, footer sections
- **Badges & Chips**: 5 color variants
- **Alerts**: Success, warning, error, info
- **Progress Bars**: Multiple variants
- **Skeleton Loaders**: Text, block, circle
- **Utility Classes**: Spacing, flexbox, grid, text alignment

### Theme Manager API

Reactive theme management:
```javascript
import { themeManager } from './src/theme-manager.js';

// Change theme
themeManager.setTheme('dark');

// Subscribe to changes
themeManager.theme$.subscribe(theme => {
  console.log('Theme:', theme);
});

// Customize colors
themeManager.setToken('color-primary', '#ff0000');

// Export/import config
const config = themeManager.exportConfig();
```

---

## 📱 BreakpointObserver Highlights

### Predefined Breakpoints

```javascript
import { Breakpoints } from './src/breakpoint-observer.js';

// Size breakpoints
Breakpoints.XSmall   // (max-width: 599.98px)
Breakpoints.Small    // 600px - 959.98px
Breakpoints.Medium   // 960px - 1279.98px
Breakpoints.Large    // 1280px - 1919.98px
Breakpoints.XLarge   // (min-width: 1920px)

// Device types
Breakpoints.Handset  // Phone
Breakpoints.Tablet   // Tablet
Breakpoints.Web      // Desktop

// Orientation
Breakpoints.HandsetPortrait
Breakpoints.TabletLandscape
// ... and more
```

### Reactive API

```javascript
import { breakpointObserver } from './src/breakpoint-observer.js';

// Observe single breakpoint
breakpointObserver.observe(Breakpoints.Handset).subscribe(state => {
  if (state.matches) {
    console.log('Mobile device');
  }
});

// Observe multiple breakpoints
breakpointObserver.observe([
  Breakpoints.Small,
  Breakpoints.Medium
]).subscribe(state => {
  console.log('Matches:', state.matches);
  console.log('Individual states:', state.breakpoints);
});

// Check current state
if (breakpointObserver.isMatched(Breakpoints.Handset)) {
  console.log('Currently on mobile');
}
```

---

## 🔧 Technology Stack

- **Language**: ES2021+ JavaScript (modules)
- **Reactive Programming**: RxJS Observables
- **Styling**: CSS Custom Properties (CSS Variables)
- **Browser APIs**: Fetch, XMLHttpRequest, MediaQueryList, LocalStorage
- **Dev Tools**: ESLint, Prettier, JSDoc, Live Server
- **No Framework**: Pure vanilla JavaScript

---

## 📊 Code Quality

- ✅ Full JSDoc documentation
- ✅ ESLint validation with JSDoc plugin
- ✅ Prettier formatting (single quotes, 2-space, semicolons)
- ✅ Comprehensive examples
- ✅ Interactive demos
- ✅ Browser compatibility
- ✅ Accessibility features (reduced motion, high contrast)

---

## 🎯 Use Cases

### BreakpointObserver

- Responsive navigation menus
- Adaptive content loading (mobile vs desktop images)
- Layout switching (grid vs list)
- Device-specific features
- Orientation-based behavior

### Design System

- Multi-tenant applications with different branding
- Accessibility-focused applications
- Dark mode support
- User preference management
- Consistent UI across large applications
- Rapid prototyping with pre-built components

### Combined Usage

```javascript
import { breakpointObserver, Breakpoints } from './src/breakpoint-observer.js';
import { themeManager } from './src/theme-manager.js';

// Auto-adjust density based on screen size
breakpointObserver.observe(Breakpoints.Handset).subscribe(state => {
  if (state.matches) {
    themeManager.setDensity('compact');
  } else {
    themeManager.setDensity('default');
  }
});

// Combine with dark mode detection
themeManager.darkMode$.subscribe(prefersDark => {
  if (prefersDark) {
    themeManager.setTheme('dark');
  }
});
```

---

## 📈 Bundle Sizes (Unminified)

| System               | Size  | Minified (est.) |
| -------------------- | ----- | --------------- |
| BreakpointObserver   | 8KB   | ~3KB            |
| Design System CSS    | 8KB   | ~5KB            |
| UI Components CSS    | 11KB  | ~7KB            |
| Theme Manager        | 13KB  | ~5KB            |
| HTTP Client          | 31KB  | ~12KB           |
| Forms System         | 31KB  | ~12KB           |
| **Total (all)**      | 102KB | ~44KB           |

---

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with ES2021+ support
- Requires: CSS Custom Properties, Fetch API, MediaQueryList

---

## 📄 License

ISC

---

## 🎓 Learning Resources

1. Start with `DESIGN-SYSTEM-QUICK-START.md` for immediate usage
2. Explore `design-system-demo.html` for interactive examples
3. Read `DESIGN-SYSTEM-README.md` for complete API documentation
4. Check `BREAKPOINT-README.md` for responsive design patterns
5. Review source code for implementation details

---

## 🚀 Next Steps

1. **Customize**: Override design tokens to match your brand
2. **Build**: Create components using the design system
3. **Integrate**: Combine BreakpointObserver with ThemeManager for responsive theming
4. **Extend**: Add new components to the library
5. **Share**: Export configurations for team consistency

---

**Happy coding! 🎉**
