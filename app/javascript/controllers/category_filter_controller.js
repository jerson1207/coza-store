// app/javascript/controllers/category_filter_controller.js
import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["productList"];

  loadProducts(event) {
    event.preventDefault();
    const categoryId = event.target.dataset.categoryId;
    fetch(`/categories/${categoryId}/products`)
      .then(response => response.text())
      .then(html => {
        this.productListTarget.innerHTML = html;
      })
      .catch(error => console.error('Error:', error));
  }
}
