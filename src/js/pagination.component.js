/**
 * Pagination Component - Page navigation with ellipsis
 */

import { ReactiveComponent, Component, EventEmitter } from './reactive-component.js';

class PaginationComponent extends ReactiveComponent {
  static _inputs = {
    'current-page': 'currentPage',
    'total-pages': 'totalPages',
    'max-visible': 'maxVisible',
  };

  static _outputs = ['pageChanged'];

  constructor() {
    super();

    this.currentPage = 1;
    this.totalPages = 10;
    this.maxVisible = 5;
  }

  ngOnInit() {
    console.log('PaginationComponent initialized');
  }

  ngAfterViewInit() {
    this.renderPageButtons();
  }

  ngAfterViewChecked() {
    this.renderPageButtons();
  }

  get visiblePages() {
    const pages = [];
    const { currentPage, totalPages, maxVisible } = this;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range with ellipsis
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, currentPage + half);

      // Adjust if we're near the beginning
      if (currentPage <= half) {
        end = maxVisible;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - half) {
        start = totalPages - maxVisible + 1;
      }

      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }

  renderPageButtons() {
    const wrapper = this.querySelector('.page-numbers');
    if (!wrapper) return;

    const currentHTML = wrapper.innerHTML;
    const pages = this.visiblePages;
    let newHTML = '';

    pages.forEach((page) => {
      const isActive = page === this.currentPage;
      const isDots = page === '...';
      const classes = ['page-button', 'page-number'];
      if (isActive) classes.push('active');
      if (isDots) classes.push('dots');

      newHTML += `<button class="${classes.join(' ')}" ${isDots ? 'disabled' : ''} data-page="${page}">${page}</button>`;
    });

    if (currentHTML.trim() !== newHTML.trim()) {
      wrapper.innerHTML = newHTML;

      // Add event listeners
      wrapper.querySelectorAll('.page-button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const page = btn.getAttribute('data-page');
          if (page !== '...') {
            this.goToPage(Number(page));
          }
        });
      });
    }
  }

  goToPage(page) {
    if (page === '...' || page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.pageChanged.emit(page);
    this.detectChanges();
  }

  ngOnChanges(changes) {
    if (changes.totalPages || changes.currentPage) {
      this.detectChanges();
    }
  }
}

Component({
  selector: 'pagination-component',
  templateUrl: '/src/js/pagination.component.html',
  styleUrl: '/src/js/pagination.component.css',
})(PaginationComponent);

export default PaginationComponent;
