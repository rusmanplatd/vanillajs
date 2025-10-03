/**
 * Tabs Component - Interactive tab navigation
 */

import { ReactiveComponent, Component, EventEmitter } from './reactive-component.js';

class TabsComponent extends ReactiveComponent {
  static _inputs = {
    tabs: 'tabs',
    'active-tab': 'activeTab',
  };

  static _outputs = ['tabChanged'];

  constructor() {
    super();

    // Default tabs
    this.tabs = [
      { id: 'tab1', label: 'Tab 1', icon: '📄' },
      { id: 'tab2', label: 'Tab 2', icon: '⚙️' },
      { id: 'tab3', label: 'Tab 3', icon: '📊' },
    ];

    this.activeTab = 'tab1';
  }

  ngOnInit() {
    console.log('TabsComponent initialized');
  }

  ngAfterViewInit() {
    this.renderTabs();
    this.renderContent();
  }

  ngAfterViewChecked() {
    this.renderTabs();
    this.renderContent();
  }

  renderTabs() {
    const header = this.querySelector('.tabs-header');
    if (!header) return;

    const currentHTML = header.innerHTML;
    let newHTML = '';

    this.tabs.forEach((tab) => {
      const isActive = tab.id === this.activeTab;
      const classes = ['tab-button'];
      if (isActive) classes.push('tab-active');
      else classes.push('tab-inactive');

      newHTML += `<button class="${classes.join(' ')}" data-tab-id="${tab.id}">`;
      if (tab.icon) {
        newHTML += `<span class="tab-icon">${tab.icon}</span>`;
      }
      newHTML += `<span class="tab-label">${tab.label}</span>`;
      newHTML += '</button>';
    });

    if (currentHTML.trim() !== newHTML.trim()) {
      header.innerHTML = newHTML;

      // Add event listeners
      header.querySelectorAll('.tab-button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab-id');
          this.selectTab(tabId);
        });
      });
    }
  }

  renderContent() {
    const content = this.querySelector('.tabs-content');
    if (!content) return;

    const currentHTML = content.innerHTML;
    let newHTML = '';

    this.tabs.forEach((tab) => {
      if (tab.id === this.activeTab) {
        newHTML += `<div class="tab-pane"><slot name="tab-${tab.id}"></slot></div>`;
      }
    });

    if (currentHTML.trim() !== newHTML.trim()) {
      content.innerHTML = newHTML;
    }
  }

  selectTab(tabId) {
    if (this.activeTab !== tabId) {
      this.activeTab = tabId;
      this.tabChanged.emit(tabId);
      this.detectChanges();
    }
  }

  ngOnChanges(changes) {
    if (changes.tabs) {
      this.detectChanges();
    }
  }
}

Component({
  selector: 'tabs-component',
  templateUrl: '/src/js/tabs.component.html',
  styleUrl: '/src/js/tabs.component.css',
})(TabsComponent);

export default TabsComponent;
