import { ReactiveComponent } from '../reactive-component.js';

/**
 * Counter Component
 * Simple counter to demonstrate reactive state
 */
export class CounterComponent extends ReactiveComponent {
  constructor() {
    super({
      selector: '#counter-app',
      template: `
        <div class="counter-container">
          <h2>{{ title }}</h2>

          <div class="counter-display">
            <div class="counter-value" [class.positive]="count > 0" [class.negative]="count < 0">
              {{ count }}
            </div>
          </div>

          <div class="counter-controls">
            <button class="btn btn-error" (click)="decrement()">
              - Decrement
            </button>
            <button class="btn btn-secondary" (click)="reset()">
              Reset
            </button>
            <button class="btn btn-success" (click)="increment()">
              + Increment
            </button>
          </div>

          <div class="counter-info">
            <div *ngIf="count === 0" class="alert alert-info">
              Counter is at zero
            </div>
            <div *ngIf="count > 0" class="alert alert-success">
              Counter is positive: {{ count }}
            </div>
            <div *ngIf="count < 0" class="alert alert-error">
              Counter is negative: {{ count }}
            </div>
          </div>

          <div class="counter-settings">
            <label>
              Step:
              <input type="number" class="input input-sm" [(ngModel)]="step" min="1" />
            </label>
            <button class="btn btn-sm btn-primary" (click)="incrementByStep()">
              Add {{ step }}
            </button>
          </div>

          <div class="counter-stats">
            <p>Total clicks: {{ totalClicks }}</p>
            <p>Doubled: {{ doubled }}</p>
            <p>Status: {{ status }}</p>
          </div>
        </div>
      `,
      data: {
        title: 'Reactive Counter',
        count: 0,
        step: 1,
        totalClicks: 0,
      },
      computed: {
        doubled: (state) => state.count * 2,
        status: (state) => {
          if (state.count === 0) {
            return 'neutral';
          }
          return state.count > 0 ? 'positive' : 'negative';
        },
      },
      methods: {
        increment() {
          this.setState((state) => ({
            count: state.count + 1,
            totalClicks: state.totalClicks + 1,
          }));
        },
        decrement() {
          this.setState((state) => ({
            count: state.count - 1,
            totalClicks: state.totalClicks + 1,
          }));
        },
        reset() {
          this.setState({ count: 0 });
        },
        incrementByStep() {
          this.setState((state) => ({
            count: state.count + parseInt(state.step, 10),
            totalClicks: state.totalClicks + 1,
          }));
        },
      },
    });
  }

  onInit() {
    console.log('CounterComponent initialized');
  }

  onMount() {
    console.log('CounterComponent mounted to:', this.el);
  }

  onChange(state) {
    console.log('State changed:', state);
  }
}
