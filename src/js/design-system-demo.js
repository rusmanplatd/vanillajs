import { themeManager } from ../src/js/theme-manager.js';

// Helper to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : null;
};

// Helper to convert RGB to Hex
const rgbToHex = (rgb) => {
  const values = rgb.match(/\d+/g);
  if (!values || values.length < 3) {
    return '#000000';
  }
  return `#${values
    .slice(0, 3)
    .map((x) => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    })
    .join('')}`;
};

// Get DOM elements
const themeSelect = document.getElementById('themeSelect');
const densitySelect = document.getElementById('densitySelect');
const scaleSlider = document.getElementById('scaleSlider');
const scaleValue = document.getElementById('scaleValue');
const primaryColorInput = document.getElementById('primaryColor');
const secondaryColorInput = document.getElementById('secondaryColor');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const systemInfo = document.getElementById('systemInfo');

// Initialize controls with current values
const initializeControls = () => {
  // Set initial values
  themeSelect.value = themeManager.theme$.getValue();
  densitySelect.value = themeManager.density$.getValue();
  scaleSlider.value = themeManager.scale$.getValue();
  scaleValue.textContent = themeManager.scale$.getValue().toFixed(1);

  // Set color inputs
  const primaryRgb = themeManager.getToken('color-primary-500');
  const secondaryRgb = themeManager.getToken('color-secondary-500');

  if (primaryRgb) {
    primaryColorInput.value = rgbToHex(primaryRgb);
  }
  if (secondaryRgb) {
    secondaryColorInput.value = rgbToHex(secondaryRgb);
  }
};

// Theme select change handler
themeSelect.addEventListener('change', (e) => {
  themeManager.setTheme(e.target.value);
});

// Density select change handler
densitySelect.addEventListener('change', (e) => {
  themeManager.setDensity(e.target.value);
});

// Scale slider change handler
scaleSlider.addEventListener('input', (e) => {
  const scale = parseFloat(e.target.value);
  scaleValue.textContent = scale.toFixed(1);
  themeManager.setScale(scale);
});

// Primary color change handler
primaryColorInput.addEventListener('input', (e) => {
  const hex = e.target.value;
  const rgb = hexToRgb(hex);
  if (rgb) {
    themeManager.setToken('color-primary-500', `rgb(${rgb})`);
    themeManager.setToken('color-primary', `rgb(${rgb})`);
  }
});

// Secondary color change handler
secondaryColorInput.addEventListener('input', (e) => {
  const hex = e.target.value;
  const rgb = hexToRgb(hex);
  if (rgb) {
    themeManager.setToken('color-secondary-500', `rgb(${rgb})`);
    themeManager.setToken('color-secondary', `rgb(${rgb})`);
  }
});

// Reset button handler
resetBtn.addEventListener('click', () => {
  themeManager.reset();
  initializeControls();
});

// Export button handler
exportBtn.addEventListener('click', () => {
  const config = themeManager.exportConfig();
  const json = JSON.stringify(config, null, 2);

  // Create a blob and download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'design-system-config.json';
  a.click();
  URL.revokeObjectURL(url);

  // Also copy to clipboard
  navigator.clipboard.writeText(json).then(() => {
    alert('Configuration exported and copied to clipboard!');
  });
});

// Subscribe to theme changes
themeManager.theme$.subscribe((theme) => {
  console.log('Theme changed to:', theme);
  updateSystemInfo();
});

// Subscribe to density changes
themeManager.density$.subscribe((density) => {
  console.log('Density changed to:', density);
  updateSystemInfo();
});

// Subscribe to scale changes
themeManager.scale$.subscribe((scale) => {
  console.log('Scale changed to:', scale);
  updateSystemInfo();
});

// Subscribe to config changes
themeManager.config$.subscribe((config) => {
  console.log('Config updated:', config);
});

// Update system info display
const updateSystemInfo = () => {
  const config = themeManager.config$.getValue();

  systemInfo.innerHTML = `
    <div style="padding: var(--spacing-4); background: var(--color-surface-variant); border-radius: var(--radius-base);">
      <h4 style="margin: 0 0 var(--spacing-2); font-size: var(--font-size-sm);">System Info</h4>
      <div style="font-size: var(--font-size-xs); line-height: var(--line-height-relaxed);">
        <div><strong>Theme:</strong> ${config.theme}</div>
        <div><strong>Density:</strong> ${config.density}</div>
        <div><strong>Scale:</strong> ${config.scale.toFixed(1)}x</div>
        <div><strong>Dark Mode:</strong> ${config.darkMode ? 'Yes' : 'No'}</div>
        <div><strong>Reduced Motion:</strong> ${config.reducedMotion ? 'Yes' : 'No'}</div>
        <div><strong>Viewport:</strong> ${window.innerWidth}×${window.innerHeight}px</div>
      </div>
    </div>
  `;
};

// Chip remove button handlers
document.querySelectorAll('.chip-remove').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.chip').remove();
  });
});

// Animate progress bars on load
window.addEventListener('load', () => {
  document.querySelectorAll('.progress-bar').forEach((bar) => {
    const { width } = bar.style;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
});

// Initialize
initializeControls();
updateSystemInfo();

// Update system info on resize
window.addEventListener('resize', () => {
  updateSystemInfo();
});

// Demo: Show reactive theme changes
console.log('Design System Demo initialized');
console.log('Try changing themes, density, or scale to see reactive updates!');
console.log('Current config:', themeManager.exportConfig());

// Example: Listen to system dark mode preference
themeManager.darkMode$.subscribe((isDark) => {
  console.log(
    'System prefers dark mode:',
    isDark,
    '- Current theme:',
    themeManager.theme$.getValue()
  );
});

// Example: Listen to reduced motion preference
themeManager.reducedMotion$.subscribe((isReduced) => {
  console.log('Reduced motion:', isReduced);
  if (isReduced) {
    console.log('Animations will be minimized');
  }
});
