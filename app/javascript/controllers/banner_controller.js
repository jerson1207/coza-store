// banner_controller.js
import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["banner"];

  connect() {
    this.bannerTarget.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
    this.bannerTarget.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
  }

  handleMouseEnter() {
    this.bannerTarget.classList.add("hovered");
  }

  handleMouseLeave() {
    this.bannerTarget.classList.remove("hovered");
  }
}
