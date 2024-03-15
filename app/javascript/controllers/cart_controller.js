import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["email", "address"];

  initialize() {
    this.updateCartUI();
  }

  updateCartUI() {
    const cart = JSON.parse(localStorage.getItem("cart"));

    if (!cart) {
      return;
    }

    let total = 0;
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = ''; // Clear existing rows

    cart.forEach(item => {
      total += item.price * item.quantity;

      const row = document.createElement("tr");

      const cell1 = document.createElement("td");
      cell1.classList.add("py-4");
      cell1.innerHTML = `
        <div class="flex items-center">
          <img class="h-16 w-16 mr-4" src="https://via.placeholder.com/150" alt="Product image">
          <span class="font-semibold">${item.name}</span>
        </div>
      `;

      const cell2 = document.createElement("td");
      cell2.classList.add("py-4");
      cell2.innerHTML = `$${item.price}`;

      const cell3 = this.createQuantityCell(item);

      const cell4 = document.createElement("td");
      cell4.classList.add("py-4");
      cell4.innerHTML = `${item.size}`;

      const cell5 = document.createElement("td");
      cell5.classList.add("py-4");
      cell5.innerHTML = `$${item.price * item.quantity}`;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Remove";
      deleteButton.value = JSON.stringify({ id: item.id, size: item.size });
      deleteButton.classList.add(
        "bg-gray-500",
        "rounded",
        "text-white",
        "px-2",
        "py-1",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "mt-2"
      );
      deleteButton.style.display = "block";
      deleteButton.addEventListener("click", this.removeFromCart.bind(this));

      row.appendChild(cell1);
      row.appendChild(cell4);
      row.appendChild(cell2);
      row.appendChild(cell3);
      row.appendChild(cell5);
      row.appendChild(deleteButton);
      tbody.appendChild(row);
    });

    const totalElement = document.getElementById("total");
    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  createQuantityCell(item) {
    const cell = document.createElement("td");
    cell.classList.add("py-4");

    const minusButton = document.createElement("button");
    minusButton.classList.add("border", "rounded-md", "py-2", "px-4", "mr-2");
    minusButton.innerText = "-";
    minusButton.addEventListener("click", () => {
      this.updateQuantity(item.id, item.size, -1);
    });

    const quantitySpan = document.createElement("span");
    quantitySpan.classList.add("text-center", "w-8", "quantity");
    quantitySpan.innerText = item.quantity;

    const plusButton = document.createElement("button");
    plusButton.classList.add("border", "rounded-md", "py-2", "px-4", "ml-2");
    plusButton.innerText = "+";
    plusButton.addEventListener("click", () => {
      this.updateQuantity(item.id, item.size, 1);
    });

    cell.appendChild(minusButton);
    cell.appendChild(quantitySpan);
    cell.appendChild(plusButton);

    return cell;
  }

  updateQuantity(id, size, increment) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const index = cart.findIndex(item => item.id === id && item.size === size);
    if (index !== -1) {
      cart[index].quantity += increment;
      if (cart[index].quantity < 1) {
        cart.splice(index, 1); // Remove item if quantity becomes zero
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      this.updateCartUI();
    }
  }

  clear() {
    localStorage.removeItem("cart");
    window.location.reload();
  }

  removeFromCart(event) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const values = JSON.parse(event.target.value);
    const { id, size } = values;
    const index = cart.findIndex(item => item.id === id && item.size === size);
    if (index >= 0) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      this.updateCartUI();
    }
  }

  checkout() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const email = this.emailTarget.value;
    const address = this.addressTarget.value;
    console.log(cart)
    const payload = {
      authenticity_token: "",
      address: address,
      email: email,
      cart: cart
    };

    const csrfToken = document.querySelector("[name='csrf-token']").content;

    fetch("/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify(payload)
    }).then(response => {
      if (response.ok) {
        console.log("Payment successful");
        this.clear();
        response.json().then(body => {
          window.location.href = body.url;
        });
      } else {
        response.json().then(body => {
          const errorEl = document.createElement("div");
          errorEl.innerText = `There was an error processing your order. ${body.error}`;
          let errorContainer = document.getElementById("errorContainer");
          errorContainer.appendChild(errorEl);
        });
      }
    });
  }
}
