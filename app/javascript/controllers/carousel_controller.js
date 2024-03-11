  // app/javascript/controllers/carousel_controller.js
  import { Controller } from "stimulus";

  export default class extends Controller {
    static targets = ["item"];
    static values = { currentIndex: Number };

    connect() {
      this.currentIndexValue = 0;
      this.showSlide();
    }

    showSlide() {
      this.itemTargets.forEach((item, index) => {
        item.style.display = index === this.currentIndexValue ? 'block' : 'none';
      });
    }

    prev() {
      this.currentIndexValue = (this.currentIndexValue - 1 + this.itemTargets.length) % this.itemTargets.length;
      this.showSlide();
    }

    next() {
      this.currentIndexValue = (this.currentIndexValue + 1) % this.itemTargets.length;
      this.showSlide();
    }
  }
