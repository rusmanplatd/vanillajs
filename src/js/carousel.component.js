/**
 * Carousel Component - Image/content slider with indicators
 */

import { ReactiveComponent, Component, EventEmitter } from './reactive-component.js';

class CarouselComponent extends ReactiveComponent {
  static _inputs = {
    items: 'items',
    loop: 'loop',
    autoplay: 'autoplay',
    interval: 'interval',
  };

  static _outputs = ['slideChanged'];

  constructor() {
    super();

    // Default items
    this.items = [
      {
        title: 'Slide 1',
        description: 'Beautiful landscape',
        image: 'https://picsum.photos/800/400?random=1',
      },
      {
        title: 'Slide 2',
        description: 'Amazing view',
        image: 'https://picsum.photos/800/400?random=2',
      },
      {
        title: 'Slide 3',
        description: 'Stunning scenery',
        image: 'https://picsum.photos/800/400?random=3',
      },
    ];

    this.currentIndex = 0;
    this.loop = true;
    this.autoplay = false;
    this.interval = 3000;
    this.autoplayTimer = null;
  }

  get translateX() {
    return -this.currentIndex * 100;
  }

  ngOnInit() {
    console.log('CarouselComponent initialized');
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  ngAfterViewInit() {
    this.renderSlides();
    this.renderIndicators();
  }

  ngAfterViewChecked() {
    this.renderSlides();
    this.renderIndicators();
  }

  renderSlides() {
    const track = this.querySelector('.carousel-track');
    if (!track) return;

    const currentHTML = track.innerHTML;
    let newHTML = '';

    this.items.forEach((item) => {
      newHTML += '<div class="carousel-slide">';
      newHTML += '<div class="slide-content">';

      if (item.image) {
        newHTML += `<div class="slide-image" style="background-image: url('${item.image}')"></div>`;
      }

      newHTML += '<div class="slide-body">';
      if (item.title) {
        newHTML += `<h3>${item.title}</h3>`;
      }
      if (item.description) {
        newHTML += `<p>${item.description}</p>`;
      }
      newHTML += '</div>'; // slide-body
      newHTML += '</div>'; // slide-content
      newHTML += '</div>'; // carousel-slide
    });

    if (currentHTML.trim() !== newHTML.trim()) {
      track.innerHTML = newHTML;
    }
  }

  renderIndicators() {
    const wrapper = this.querySelector('.indicators-wrapper');
    if (!wrapper) return;

    const currentHTML = wrapper.innerHTML;
    let newHTML = '';

    this.items.forEach((item, index) => {
      const isActive = index === this.currentIndex;
      newHTML += `<button class="indicator-dot ${isActive ? 'active' : ''}" data-index="${index}"></button>`;
    });

    if (currentHTML.trim() !== newHTML.trim()) {
      wrapper.innerHTML = newHTML;

      // Add event listeners
      wrapper.querySelectorAll('.indicator-dot').forEach((btn) => {
        btn.addEventListener('click', () => {
          const index = Number(btn.getAttribute('data-index'));
          this.goToSlide(index);
        });
      });
    }
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    } else if (this.loop) {
      this.currentIndex = 0;
    }
    this.slideChanged.emit(this.currentIndex);
    this.detectChanges();
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.loop) {
      this.currentIndex = this.items.length - 1;
    }
    this.slideChanged.emit(this.currentIndex);
    this.detectChanges();
  }

  goToSlide(index) {
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index;
      this.slideChanged.emit(this.currentIndex);
      this.detectChanges();
    }
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.next();
    }, this.interval);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  ngOnChanges(changes) {
    if (changes.autoplay) {
      if (this.autoplay) {
        this.startAutoplay();
      } else {
        this.stopAutoplay();
      }
    }

    if (changes.items) {
      // Reset to first slide if items change
      this.currentIndex = 0;
      this.detectChanges();
    }
  }
}

Component({
  selector: 'carousel-component',
  templateUrl: '/src/js/carousel.component.html',
  styleUrl: '/src/js/carousel.component.css',
})(CarouselComponent);

export default CarouselComponent;
