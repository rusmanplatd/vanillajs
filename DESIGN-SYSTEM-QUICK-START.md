# Design System Quick Start Guide

Get up and running with the reactive design system in 5 minutes.

## Installation

No installation needed! Just include the CSS files:

```html
<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="./src/design-system.css" />
    <link rel="stylesheet" href="./src/ui-components.css" />
  </head>
  <body>
    <!-- Your content here -->
  </body>
</html>
```

## Basic Usage

### 1. Use Pre-built Components

```html
<!-- Button -->
<button class="btn btn-primary">Click Me</button>

<!-- Input -->
<input type="text" class="input" placeholder="Type here..." />

<!-- Card -->
<div class="card">
  <h3 class="card-title">Welcome</h3>
  <p class="card-body">This is a card component.</p>
</div>

<!-- Badge -->
<span class="badge badge-success">New</span>
```

### 2. Enable Theme Switching

```html
<script type="module">
  import { themeManager } from './src/theme-manager.js';

  // Toggle theme on button click
  document.getElementById('themeBtn').addEventListener('click', () => {
    themeManager.toggleTheme();
  });
</script>
```

### 3. Customize Colors

```html
<script type="module">
  import { themeManager } from './src/theme-manager.js';

  // Set custom brand colors
  themeManager.setToken('color-primary', '#ff0000');
  themeManager.setToken('color-secondary', '#00ff00');
</script>
```

## Complete Example

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    <link rel="stylesheet" href="./src/design-system.css" />
    <link rel="stylesheet" href="./src/ui-components.css" />
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Theme Demo</h2>
        </div>
        <div class="card-body">
          <p class="mb-4">Choose your theme:</p>

          <div class="flex gap-4">
            <button class="btn btn-primary" id="lightBtn">Light</button>
            <button class="btn btn-primary" id="darkBtn">Dark</button>
            <button class="btn btn-outlined" id="toggleBtn">Toggle</button>
          </div>

          <div class="mt-6">
            <label class="control-label">Your Name</label>
            <input type="text" class="input" placeholder="Enter name..." />
          </div>

          <div class="mt-4">
            <label class="switch">
              <input type="checkbox" />
              <span class="switch-slider"></span>
            </label>
            <span class="ml-2">Enable notifications</span>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-success">Save</button>
        </div>
      </div>
    </div>

    <script type="module">
      import { themeManager } from './src/theme-manager.js';

      document.getElementById('lightBtn').addEventListener('click', () => {
        themeManager.setTheme('light');
      });

      document.getElementById('darkBtn').addEventListener('click', () => {
        themeManager.setTheme('dark');
      });

      document.getElementById('toggleBtn').addEventListener('click', () => {
        themeManager.toggleTheme();
      });

      // Subscribe to theme changes
      themeManager.theme$.subscribe((theme) => {
        console.log('Current theme:', theme);
      });
    </script>
  </body>
</html>
```

## Common Patterns

### Theme Selector Dropdown

```html
<select id="themeSelect" class="input">
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="high-contrast">High Contrast</option>
</select>

<script type="module">
  import { themeManager } from './src/theme-manager.js';

  const select = document.getElementById('themeSelect');

  // Set initial value
  select.value = themeManager.theme$.getValue();

  // Handle changes
  select.addEventListener('change', (e) => {
    themeManager.setTheme(e.target.value);
  });

  // Update select when theme changes elsewhere
  themeManager.theme$.subscribe((theme) => {
    select.value = theme;
  });
</script>
```

### Responsive Density

```html
<script type="module">
  import { breakpointObserver, Breakpoints } from './src/breakpoint-observer.js';
  import { themeManager } from './src/theme-manager.js';

  breakpointObserver.observe(Breakpoints.Handset).subscribe((state) => {
    if (state.matches) {
      themeManager.setDensity('compact'); // Mobile gets compact UI
    } else {
      themeManager.setDensity('default');
    }
  });
</script>
```

### Color Customization UI

```html
<label>
  Primary Color:
  <input type="color" id="primaryColor" value="#2196f3" />
</label>

<script type="module">
  import { themeManager } from './src/theme-manager.js';

  document.getElementById('primaryColor').addEventListener('input', (e) => {
    const hex = e.target.value;
    // Convert hex to rgb
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    themeManager.setToken('color-primary', `rgb(${r}, ${g}, ${b})`);
  });
</script>
```

## Next Steps

1. **Explore the Demo**: Open `design-system-demo.html` to see all components
2. **Read the Docs**: Check `DESIGN-SYSTEM-README.md` for complete documentation
3. **Customize**: Override tokens to match your brand
4. **Build**: Create your own components using design tokens

## Helpful Resources

- All color tokens: Check `:root` in `design-system.css`
- All components: See `ui-components.css`
- Theme Manager API: See `theme-manager.js`
- Live examples: `design-system-demo.html`

## Tips

- Use CSS variables in your custom styles: `color: var(--color-primary)`
- Subscribe to observables to react to theme changes
- Test all themes to ensure proper contrast
- Use the spacing scale for consistent layouts
- Leverage utility classes for rapid development
