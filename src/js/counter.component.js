/**
 * Counter Component - Angular-style
 * Demonstrates reactive component with external HTML and CSS files
 */

import { ReactiveComponent, Component, Input, Output, EventEmitter } from './reactive-component.js';

/**
 * Counter component with Angular-style architecture
 * @class CounterComponent
 * @extends ReactiveComponent
 */
class CounterComponent extends ReactiveComponent {
  // @Input decorator for initial count
  static _inputs = { 'initial-count': 'initialCount', 'max-count': 'maxCount' };

  // @Output decorator for count changes
  static _outputs = ['countChanged'];

  constructor() {
    super();

    // Component properties
    this.count = 0;
    this.initialCount = 0;
    this.maxCount = 100;
  }

  /**
   * Angular lifecycle: Component initialization
   */
  ngOnInit() {
    console.log('CounterComponent initialized');
    if (this.initialCount !== undefined) {
      this.count = parseInt(this.initialCount, 10) || 0;
    }
  }

  /**
   * Angular lifecycle: After view initialization
   */
  ngAfterViewInit() {
    console.log('CounterComponent view initialized');
  }

  /**
   * Angular lifecycle: Input changes
   * @param {Object} changes - Changes object
   */
  ngOnChanges(changes) {
    console.log('Input changed:', changes);
    if (changes.initialCount && changes.initialCount.currentValue !== undefined) {
      this.count = parseInt(changes.initialCount.currentValue, 10) || 0;
    }
  }

  /**
   * Angular lifecycle: Component destruction
   */
  ngOnDestroy() {
    console.log('CounterComponent destroyed');
  }

  /**
   * Increment counter
   */
  increment() {
    if (this.count < this.maxCount) {
      this.count++;
      this.countChanged.emit(this.count);
      this.detectChanges();
    }
  }

  /**
   * Decrement counter
   */
  decrement() {
    this.count--;
    this.countChanged.emit(this.count);
    this.detectChanges();
  }

  /**
   * Reset counter
   */
  reset() {
    this.count = 0;
    this.countChanged.emit(this.count);
    this.detectChanges();
  }
}

// Register component using the Component decorator function
export default Component({
  selector: 'counter-component',
  templateUrl: '/src/js/counter.component.html',
  styleUrl: '/src/js/counter.component.css',
})(CounterComponent);
