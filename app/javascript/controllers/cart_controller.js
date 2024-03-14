import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="cart"
export default class extends Controller {
  static targets = ["email", "address"]
  checkoutButton

  initialize() {
    const cart = JSON.parse(localStorage.getItem("cart"))
   
    if (!cart) {
      return
    }    

    let total = 0
    for (let i=0; i < cart.length; i++) {
      const item = cart[i]
      total += item.price * item.quantity
      const div = document.createElement("div")
      var tbody = document.querySelector("table tbody")
      var row = document.createElement("tr");
      var cell1 = document.createElement("td");
    
      cell1.classList.add("py-4");
      cell1.innerHTML = `
        <div class="flex items-center">
          <img class="h-16 w-16 mr-4" src="https://via.placeholder.com/150" alt="Product image">
          <span class="font-semibold">${item.name}</span>
        </div>
      `;
      
      var cell2 = document.createElement("td");
      cell2.classList.add("py-4");
      cell2.innerHTML = `$${item.price/100.0}`;

      var cell3 = document.createElement("td");
      cell3.classList.add("py-4");
      cell3.innerHTML = `<td class="py-4">
                            <div class="flex items-center">
                                <button class="border rounded-md py-2 px-4 mr-2">-</button>
                                <span class="text-center w-8">${item.quantity}</span>
                                <button class="border rounded-md py-2 px-4 ml-2">+</button>
                            </div>
                          </td>`;

      var cell4 = document.createElement("td");
      cell4.classList.add("py-4");
      cell4.innerHTML = `${item.size}`;

      var cell5 = document.createElement("td");
      cell5.classList.add("py-4");
      cell5.innerHTML = `$${total/100.0}`;

      const deleteButton = document.createElement("button")
      deleteButton.innerText = "Remove"
      deleteButton.value = JSON.stringify({id: item.id, size: item.size})
      deleteButton.classList.add("bg-gray-500", "rounded", "text-white", "px-2", "py-1", "d-flex", "justify-content-center", "align-items-center", "mt-2");
      deleteButton.style.display = "block"; // Ensure it's displayed as a block element
      deleteButton.addEventListener("click", this.removeFromCart)
     
      row.appendChild(cell1);
      row.appendChild(cell4);
      row.appendChild(cell2);
      row.appendChild(cell3);
      row.appendChild(cell5);
      row.appendChild(deleteButton)
      row.appendChild(deleteButton)
      tbody.appendChild(row);
    }    
  }

  clear() {
    localStorage.removeItem("cart")
    window.location.reload()
  }

  removeFromCart(event) {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const values = JSON.parse(event.target.value)
    const {id, size} = values
    const index = cart.findIndex(item => item.id === id && item.size === size)
    if (index >= 0) {
      cart.splice(index, 1)
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    window.location.reload()
  }

  checkout() {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const email = this.emailTarget.value
    const address = this.addressTarget.value
    const payload = {
      authenticity_token: "",
      address: address,
      email: email,
      cart: cart
    }

    const csrfToken = document.querySelector("[name='csrf-token']").content

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
            window.location.href = body.url
          })
        } else {
          response.json().then(body => {
            const errorEl = document.createElement("div")
            errorEl.innerText = `There was an error processing your order. ${body.error}`
            let errorContainer = document.getElementById("errorContainer")
            errorContainer.appendChild(errorEl)
          })
        }
      })
  }

}