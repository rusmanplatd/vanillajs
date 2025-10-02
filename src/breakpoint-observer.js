import { BehaviorSubject, Observable } from '../packages/rxjs/index.js';

/**
 * Breakpoint state representing the result of a media query
 * @typedef {object} BreakpointState
 * @property {boolean} matches - Whether the media query matches
 * @property {Record<string, boolean>} breakpoints - Map of breakpoint queries to their match state
 */

/**
 * Predefined breakpoints for common screen sizes
 * Based on Angular CDK Breakpoints
 */
export const Breakpoints = {
  // Handset (phones)
  XSmall: '(max-width: 599.98px)',
  Small: '(min-width: 600px) and (max-width: 959.98px)',
  Medium: '(min-width: 960px) and (max-width: 1279.98px)',
  Large: '(min-width: 1280px) and (max-width: 1919.98px)',
  XLarge: '(min-width: 1920px)',

  // Handset in portrait
  HandsetPortrait: '(max-width: 599.98px) and (orientation: portrait)',
  // Handset in landscape
  HandsetLandscape: '(max-width: 959.98px) and (orientation: landscape)',

  // Tablet in portrait
  TabletPortrait:
    '(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)',
  // Tablet in landscape
  TabletLandscape:
    '(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)',

  // Web in portrait
  WebPortrait: '(min-width: 840px) and (orientation: portrait)',
  // Web in landscape
  WebLandscape: '(min-width: 1280px) and (orientation: landscape)',

  // Combined breakpoints
  Handset:
    '(max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)',
  Tablet:
    '(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)',
  Web: '(min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)',
};

/**
 * BreakpointObserver service for responsive layout detection
 * Similar to Angular CDK's BreakpointObserver
 * @example
 * const observer = new BreakpointObserver();
 *
 * observer.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(state => {
 *   if (state.matches) {
 *     console.log('Mobile or tablet view');
 *   }
 * });
 */
export class BreakpointObserver {
  /**
   * Creates a new BreakpointObserver instance
   */
  constructor() {
    /**
     * Map of media query strings to their MediaQueryList objects
     * @private
     * @type {Map<string, MediaQueryList>}
     */
    this._mediaQueryLists = new Map();

    /**
     * Map of media query strings to their BehaviorSubject streams
     * @private
     * @type {Map<string, BehaviorSubject<boolean>>}
     */
    this._subjects = new Map();

    /**
     * Map of media query strings to their listener functions
     * @private
     * @type {Map<string, Function>}
     */
    this._listeners = new Map();
  }

  /**
   * Observe one or more media queries for changes
   * @param {string|string[]} queries - Media query or array of media queries to observe
   * @returns {Observable<BreakpointState>} Observable that emits breakpoint state changes
   * @example
   * observer.observe(Breakpoints.Handset).subscribe(state => {
   *   console.log('Handset:', state.matches);
   * });
   * @example
   * observer.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(state => {
   *   console.log('Matches:', state.matches);
   *   console.log('Breakpoints:', state.breakpoints);
   * });
   */
  observe(queries) {
    const queryArray = Array.isArray(queries) ? queries : [queries];

    // Ensure all queries are registered
    queryArray.forEach((query) => this._registerQuery(query));

    return new Observable((observer) => {
      // Create initial state
      const emitState = () => {
        const breakpoints = {};
        let matches = false;

        queryArray.forEach((query) => {
          const mql = this._mediaQueryLists.get(query);
          const queryMatches = mql ? mql.matches : false;
          breakpoints[query] = queryMatches;
          if (queryMatches) {
            matches = true;
          }
        });

        observer.next({ matches, breakpoints });
      };

      // Emit initial state
      emitState();

      // Subscribe to all queries
      const subscriptions = queryArray.map((query) => {
        const subject = this._subjects.get(query);
        return subject.subscribe(() => emitState());
      });

      // Cleanup function
      return () => {
        subscriptions.forEach((sub) => sub.unsubscribe());
      };
    });
  }

  /**
   * Check if one or more media queries currently match
   * @param {string|string[]} queries - Media query or array of media queries to check
   * @returns {boolean} True if any of the queries match
   * @example
   * if (observer.isMatched(Breakpoints.Handset)) {
   *   console.log('Mobile device detected');
   * }
   */
  isMatched(queries) {
    const queryArray = Array.isArray(queries) ? queries : [queries];

    return queryArray.some((query) => {
      this._registerQuery(query);
      const mql = this._mediaQueryLists.get(query);
      return mql ? mql.matches : false;
    });
  }

  /**
   * Register a media query for observation
   * @private
   * @param {string} query - Media query string
   */
  _registerQuery(query) {
    if (this._mediaQueryLists.has(query)) {
      return;
    }

    // Create MediaQueryList
    const mql = window.matchMedia(query);
    this._mediaQueryLists.set(query, mql);

    // Create BehaviorSubject
    const subject = new BehaviorSubject(mql.matches);
    this._subjects.set(query, subject);

    // Create and register listener
    const listener = (event) => {
      subject.next(event.matches);
    };
    this._listeners.set(query, listener);

    // Add listener (use addEventListener for modern browsers)
    if (mql.addEventListener) {
      mql.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      mql.addListener(listener);
    }
  }

  /**
   * Unregister a media query and clean up its resources
   * @private
   * @param {string} query - Media query string
   */
  _unregisterQuery(query) {
    const mql = this._mediaQueryLists.get(query);
    const listener = this._listeners.get(query);
    const subject = this._subjects.get(query);

    if (mql && listener) {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', listener);
      } else {
        // Fallback for older browsers
        mql.removeListener(listener);
      }
    }

    if (subject) {
      subject.complete();
    }

    this._mediaQueryLists.delete(query);
    this._listeners.delete(query);
    this._subjects.delete(query);
  }

  /**
   * Clean up all registered media queries and observers
   * Should be called when the observer is no longer needed
   * @example
   * const observer = new BreakpointObserver();
   * // ... use observer ...
   * observer.destroy();
   */
  destroy() {
    const queries = Array.from(this._mediaQueryLists.keys());
    queries.forEach((query) => this._unregisterQuery(query));
  }

  /**
   * Get the current state of one or more media queries without observing
   * @param {string|string[]} queries - Media query or array of media queries
   * @returns {BreakpointState} Current breakpoint state
   * @example
   * const state = observer.getState([Breakpoints.Small, Breakpoints.Medium]);
   * console.log('Currently matches:', state.matches);
   * console.log('Breakpoint states:', state.breakpoints);
   */
  getState(queries) {
    const queryArray = Array.isArray(queries) ? queries : [queries];
    const breakpoints = {};
    let matches = false;

    queryArray.forEach((query) => {
      this._registerQuery(query);
      const mql = this._mediaQueryLists.get(query);
      const queryMatches = mql ? mql.matches : false;
      breakpoints[query] = queryMatches;
      if (queryMatches) {
        matches = true;
      }
    });

    return { matches, breakpoints };
  }
}

/**
 * Singleton instance of BreakpointObserver
 * Use this for a shared instance across your application
 * @example
 * import { breakpointObserver, Breakpoints } from './breakpoint-observer.js';
 *
 * breakpointObserver.observe(Breakpoints.Handset).subscribe(state => {
 *   console.log('Mobile view:', state.matches);
 * });
 */
export const breakpointObserver = new BreakpointObserver();
