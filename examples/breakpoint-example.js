import { Breakpoints, breakpointObserver } from '../src/breakpoint-observer.js';

// Helper function to format time
const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false });
};

// Helper function to add log entry
const logEvent = (event, value) => {
  const logContainer = document.getElementById('eventLog');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-time">[${formatTime()}]</span> <span class="log-event">${event}</span>: <span class="log-value">${value}</span>`;
  logContainer.insertBefore(entry, logContainer.firstChild);

  // Keep only last 50 entries
  while (logContainer.children.length > 50) {
    logContainer.removeChild(logContainer.lastChild);
  }
};

// Update viewport dimensions
const updateDimensions = () => {
  document.getElementById('viewportWidth').textContent =
    `${window.innerWidth}px`;
  document.getElementById('viewportHeight').textContent =
    `${window.innerHeight}px`;
  document.getElementById('orientation').textContent =
    window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait';
};

// Create status item
const createStatusItem = (label, query, matches) => {
  const item = document.createElement('div');
  item.className = `status-item ${matches ? 'active' : 'inactive'}`;
  item.innerHTML = `
    <div class="status-label">${label}</div>
    <div class="status-value">${query}</div>
    <span class="status-badge ${matches ? 'matched' : 'unmatched'}">${matches ? '✓ Matched' : '✗ Not Matched'}</span>
  `;
  return item;
};

// Define breakpoint categories
const sizeBreakpoints = {
  XSmall: Breakpoints.XSmall,
  Small: Breakpoints.Small,
  Medium: Breakpoints.Medium,
  Large: Breakpoints.Large,
  XLarge: Breakpoints.XLarge,
};

const deviceBreakpoints = {
  Handset: Breakpoints.Handset,
  Tablet: Breakpoints.Tablet,
  Web: Breakpoints.Web,
};

const orientationBreakpoints = {
  'Handset Portrait': Breakpoints.HandsetPortrait,
  'Handset Landscape': Breakpoints.HandsetLandscape,
  'Tablet Portrait': Breakpoints.TabletPortrait,
  'Tablet Landscape': Breakpoints.TabletLandscape,
  'Web Portrait': Breakpoints.WebPortrait,
  'Web Landscape': Breakpoints.WebLandscape,
};

// Update breakpoint display
const updateBreakpoints = (container, breakpointMap, state) => {
  container.innerHTML = '';
  Object.entries(breakpointMap).forEach(([label, query]) => {
    const matches = state.breakpoints[query] || false;
    container.appendChild(createStatusItem(label, query, matches));
  });
};

// Update device type display
const updateDeviceType = () => {
  let deviceType = '🖥️ Desktop';
  let color = '#667eea';

  if (breakpointObserver.isMatched(Breakpoints.Handset)) {
    deviceType = '📱 Handset';
    color = '#4caf50';
  } else if (breakpointObserver.isMatched(Breakpoints.Tablet)) {
    deviceType = '📱 Tablet';
    color = '#ff9800';
  }

  const currentSize = document.getElementById('currentSize');
  const deviceTypeEl = document.getElementById('deviceType');
  deviceTypeEl.textContent = `${deviceType} - ${window.innerWidth}px × ${window.innerHeight}px`;
  currentSize.style.background = `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`;
};

// Initialize the page
const init = () => {
  updateDimensions();
  updateDeviceType();

  logEvent('BreakpointObserver', 'Initialized');

  // Observe size breakpoints
  breakpointObserver.observe(Object.values(sizeBreakpoints)).subscribe({
    next: (state) => {
      const container = document.getElementById('sizeBreakpoints');
      updateBreakpoints(container, sizeBreakpoints, state);

      const matched = Object.entries(state.breakpoints)
        .filter(([, matches]) => matches)
        .map(([query]) => {
          const entry = Object.entries(sizeBreakpoints).find(
            ([, q]) => q === query
          );
          return entry ? entry[0] : query;
        })
        .join(', ');

      if (matched) {
        logEvent('Size Breakpoint', matched);
      }
    },
  });

  // Observe device breakpoints
  breakpointObserver.observe(Object.values(deviceBreakpoints)).subscribe({
    next: (state) => {
      const container = document.getElementById('deviceBreakpoints');
      updateBreakpoints(container, deviceBreakpoints, state);

      const matched = Object.entries(state.breakpoints)
        .filter(([, matches]) => matches)
        .map(([query]) => {
          const entry = Object.entries(deviceBreakpoints).find(
            ([, q]) => q === query
          );
          return entry ? entry[0] : query;
        })
        .join(', ');

      if (matched) {
        logEvent('Device Type', matched);
      }

      updateDeviceType();
    },
  });

  // Observe orientation breakpoints
  breakpointObserver.observe(Object.values(orientationBreakpoints)).subscribe({
    next: (state) => {
      const container = document.getElementById('orientationBreakpoints');
      updateBreakpoints(container, orientationBreakpoints, state);

      const matched = Object.entries(state.breakpoints)
        .filter(([, matches]) => matches)
        .map(([query]) => {
          const entry = Object.entries(orientationBreakpoints).find(
            ([, q]) => q === query
          );
          return entry ? entry[0] : query;
        })
        .join(', ');

      if (matched) {
        logEvent('Orientation', matched);
      }
    },
  });

  // Update dimensions on resize
  window.addEventListener('resize', () => {
    updateDimensions();
    logEvent(
      'Window Resize',
      `${window.innerWidth}px × ${window.innerHeight}px`
    );
  });

  // Log initial state
  logEvent('Viewport', `${window.innerWidth}px × ${window.innerHeight}px`);
};

// Start the application
init();
