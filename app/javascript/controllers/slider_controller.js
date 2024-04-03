import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["slide"];
  slideIndex = 0;
  intervalId = null;

  connect() {
    this.showSlide(this.slideIndex);
    this.startAutoSlide();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 20000); 
  }

  stopAutoSlide() {
    clearInterval(this.intervalId);
  }

  previousSlide() {
    this.stopAutoSlide();
    this.showSlide(this.slideIndex - 1);
    this.startAutoSlide();
  }

  nextSlide() {
    this.stopAutoSlide();
    this.showSlide(this.slideIndex + 1);
    this.startAutoSlide();
  }

  showSlide(index) {
    const slides = this.slideTargets;

    if (index >= slides.length) {
      this.slideIndex = 0;
    } else if (index < 0) {
      this.slideIndex = slides.length - 1;
    } else {
      this.slideIndex = index;
    }

    slides.forEach((slide) => {
      slide.style.display = "none";
    });

    slides[this.slideIndex].style.display = "block";
  }
}
