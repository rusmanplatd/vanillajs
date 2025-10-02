# BreakpointObserver

A responsive layout detection utility for vanilla JavaScript, inspired by Angular CDK's BreakpointObserver. Built with RxJS Observables for reactive breakpoint detection.

## Features

- ✅ **Observable-based** - RxJS Observables for reactive programming
- ✅ **Predefined Breakpoints** - Common screen sizes (XSmall, Small, Medium, Large, XLarge)
- ✅ **Device Type Detection** - Handset, Tablet, Web
- ✅ **Orientation Support** - Portrait and landscape detection
- ✅ **Multiple Query Support** - Observe multiple breakpoints simultaneously
- ✅ **Singleton Instance** - Shared observer across your application
- ✅ **Clean API** - Simple and intuitive methods
- ✅ **TypeScript-ready** - Full JSDoc annotations

## Installation

Already included in the project. Import from `src/breakpoint-observer.js`.

## Usage

### Basic Example

```javascript
import { breakpointObserver, Breakpoints } from './src/breakpoint-observer.js';

// Observe a single breakpoint
breakpointObserver.observe(Breakpoints.Handset).subscribe((state) => {
  if (state.matches) {
    console.log('Mobile device detected');
  }
});
```

### Multiple Breakpoints

```javascript
// Observe multiple breakpoints
breakpointObserver
  .observe([Breakpoints.Small, Breakpoints.Medium])
  .subscribe((state) => {
    console.log('Matches any:', state.matches);
    console.log('Breakpoint states:', state.breakpoints);
  });
```

### Check Current State

```javascript
// Synchronously check if a breakpoint matches
if (breakpointObserver.isMatched(Breakpoints.Handset)) {
  console.log('Currently on mobile');
}

// Get full state without observing
const state = breakpointObserver.getState([
  Breakpoints.Small,
  Breakpoints.Medium,
]);
console.log('Current state:', state);
```

### Custom Instance

```javascript
import { BreakpointObserver } from './src/breakpoint-observer.js';

// Create your own instance (not singleton)
const myObserver = new BreakpointObserver();

myObserver.observe('(max-width: 768px)').subscribe((state) => {
  console.log('Custom breakpoint:', state.matches);
});

// Clean up when done
myObserver.destroy();
```

## Predefined Breakpoints

### Size Breakpoints

```javascript
Breakpoints.XSmall;  // (max-width: 599.98px)
Breakpoints.Small;   // (min-width: 600px) and (max-width: 959.98px)
Breakpoints.Medium;  // (min-width: 960px) and (max-width: 1279.98px)
Breakpoints.Large;   // (min-width: 1280px) and (max-width: 1919.98px)
Breakpoints.XLarge;  // (min-width: 1920px)
```

### Device Type Breakpoints

```javascript
Breakpoints.Handset; // Phone in portrait or landscape
Breakpoints.Tablet;  // Tablet in portrait or landscape
Breakpoints.Web;     // Desktop/web browser
```

### Orientation Breakpoints

```javascript
Breakpoints.HandsetPortrait;  // Phone in portrait
Breakpoints.HandsetLandscape; // Phone in landscape
Breakpoints.TabletPortrait;   // Tablet in portrait
Breakpoints.TabletLandscape;  // Tablet in landscape
Breakpoints.WebPortrait;      // Desktop in portrait
Breakpoints.WebLandscape;     // Desktop in landscape
```

## API Reference

### BreakpointObserver Class

#### Methods

##### `observe(queries)`

Observe one or more media queries for changes.

**Parameters:**

- `queries` - `string | string[]` - Media query or array of queries

**Returns:** `Observable<BreakpointState>`

**Example:**

```javascript
observer.observe(Breakpoints.Handset).subscribe((state) => {
  console.log('Handset:', state.matches);
});
```

##### `isMatched(queries)`

Check if one or more media queries currently match (synchronous).

**Parameters:**

- `queries` - `string | string[]` - Media query or array of queries

**Returns:** `boolean` - True if any query matches

**Example:**

```javascript
if (observer.isMatched(Breakpoints.Small)) {
  console.log('Small screen detected');
}
```

##### `getState(queries)`

Get the current state without observing (synchronous).

**Parameters:**

- `queries` - `string | string[]` - Media query or array of queries

**Returns:** `BreakpointState`

**Example:**

```javascript
const state = observer.getState([Breakpoints.Small, Breakpoints.Medium]);
console.log('Current state:', state);
```

##### `destroy()`

Clean up all registered media queries and observers.

**Example:**

```javascript
const observer = new BreakpointObserver();
// ... use observer ...
observer.destroy();
```

### BreakpointState Type

```typescript
{
  matches: boolean;           // True if any query matches
  breakpoints: {              // Map of queries to match state
    [query: string]: boolean;
  }
}
```

## Real-World Examples

### Responsive Navigation

```javascript
import { breakpointObserver, Breakpoints } from './breakpoint-observer.js';

const nav = document.querySelector('.nav');

breakpointObserver.observe(Breakpoints.Handset).subscribe((state) => {
  if (state.matches) {
    // Show mobile menu
    nav.classList.add('mobile');
  } else {
    // Show desktop menu
    nav.classList.remove('mobile');
  }
});
```

### Adaptive Content Loading

```javascript
breakpointObserver
  .observe([Breakpoints.XSmall, Breakpoints.Small])
  .subscribe((state) => {
    if (state.matches) {
      // Load mobile-optimized images
      loadMobileImages();
    } else {
      // Load full-resolution images
      loadDesktopImages();
    }
  });
```

### Layout Switching

```javascript
breakpointObserver
  .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
  .subscribe((state) => {
    const layout = state.matches ? 'grid' : 'list';
    document.body.setAttribute('data-layout', layout);
  });
```

### Orientation-Specific Logic

```javascript
breakpointObserver
  .observe([Breakpoints.HandsetLandscape, Breakpoints.TabletLandscape])
  .subscribe((state) => {
    if (state.matches) {
      // Enable landscape-specific features
      enableLandscapeMode();
    }
  });
```

## Live Demo

Run the interactive example to see breakpoints in action:

```bash
npm start
# Then open breakpoint-example.html in your browser
```

The demo page shows:

- Current viewport dimensions
- Real-time breakpoint status
- Device type detection
- Orientation detection
- Event logging

## Custom Media Queries

You can use any valid CSS media query:

```javascript
// Custom width
breakpointObserver.observe('(max-width: 768px)').subscribe((state) => {
  console.log('Narrow screen:', state.matches);
});

// Dark mode
breakpointObserver.observe('(prefers-color-scheme: dark)').subscribe((state) => {
  console.log('Dark mode:', state.matches);
});

// High resolution
breakpointObserver.observe('(min-resolution: 2dppx)').subscribe((state) => {
  console.log('Retina display:', state.matches);
});

// Hover capability
breakpointObserver.observe('(hover: hover)').subscribe((state) => {
  console.log('Has hover:', state.matches);
});
```

## Browser Support

- Modern browsers with ES2021+ support
- `window.matchMedia()` API
- MediaQueryList with `addEventListener` (with fallback)

## Comparison with Angular CDK

This implementation provides similar functionality to Angular CDK's BreakpointObserver:

| Feature                  | Angular CDK | This Implementation |
| ------------------------ | ----------- | ------------------- |
| Observable-based         | ✅          | ✅                  |
| Predefined breakpoints   | ✅          | ✅                  |
| Multiple queries         | ✅          | ✅                  |
| Custom queries           | ✅          | ✅                  |
| Singleton instance       | ✅          | ✅                  |
| TypeScript support       | ✅          | ✅ (via JSDoc)      |
| Framework dependency     | Angular     | None (Vanilla JS)   |
| Size (unminified)        | ~10KB       | ~8KB                |

## Performance Notes

- Media query listeners are automatically managed
- Queries are registered only once, even if observed multiple times
- Resources are cleaned up when observers unsubscribe
- Use the singleton `breakpointObserver` for better performance

## License

ISC
