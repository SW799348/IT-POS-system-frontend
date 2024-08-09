document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("orderIdField").value = generateOrderId();
  document.getElementById("currentDate").value = getCurrentDate();
  populateCustomerOptions();
  populateItemOptions();
  document.getElementById("orderQtyField").addEventListener("change", checkQtyHand);

  document.getElementById("tblOrder").addEventListener("click", function (event) {
    if (event.target.classList.contains("delete")) {
      let itemId = event.target.id;
      removeFromCart(itemId);
    }
  });
});

// ====================generate order id=================================================================

function generateOrderId() {
  return fetch("http://localhost:8080/purchasedOrders")
    .then((response) => response.json())
    .then((orders) => {
      if (orders.length === 0) {
        return "#001";
      } else {
        let lastOrderId = orders[orders.length - 1].id;
        let nextOrderId = parseInt(lastOrderId.substring(1)) + 1;
        return `#${String(nextOrderId).padStart(3, "0")}`;
      }
    })
    .catch((error) => console.error("Error generating Order ID:", error));
}

function getCurrentDate() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// ====================set customer drop box================================================================

function populateCustomerOptions() {
  let dropdown = document.getElementById("customerIdDropDown");
  dropdown.innerHTML = "";

  let defaultOption = document.createElement("option");
  defaultOption.text = "Select a customer";
  dropdown.add(defaultOption);

  fetch("http://localhost:8080/customers")
    .then((response) => response.json())
    .then((customers) => {
      customers.forEach(function (customer) {
        let option = document.createElement("option");
        option.value = customer.id;
        option.text = customer.id;
        dropdown.add(option);
      });
    })
    .catch((error) => console.error("Error populating customer options:", error));
}

var customerIdDropDown = document.getElementById("customerIdDropDown");
var customerIdField = document.getElementById("customerIdField");
var customerNameField = document.getElementById("customerNameField");
var salaryField = document.getElementById("salaryField");
var addressField = document.getElementById("addressField");
customerIdField.readOnly = true;
customerNameField.readOnly = true;
salaryField.readOnly = true;
addressField.readOnly = true;

customerIdDropDown.addEventListener("change", function () {
  var selectedCustomerId = customerIdDropDown.value;

  fetch(`http://localhost:8080/customers/${selectedCustomerId}`)
    .then((response) => response.json())
    .then((customer) => {
      if (customer) {
        customerIdField.value = customer.id;
        customerNameField.value = customer.name;
        salaryField.value = customer.salary;
        addressField.value = customer.address;
      } else {
        alert("Customer not found");
      }
    })
    .catch((error) => console.error("Error fetching customer details:", error));
});

// ====================set item drop box================================================================

function populateItemOptions() {
  let dropdownItem = document.getElementById("itemIdDropDown");
  dropdownItem.innerHTML = "";

  let defaultOptionItem = document.createElement("option");
  defaultOptionItem.text = "Select an item";
  defaultOptionItem.value = "";
  dropdownItem.add(defaultOptionItem);

  fetch("http://localhost:8080/items")
    .then((response) => response.json())
    .then((items) => {
      items.forEach(function (item) {
        let optionItem = document.createElement("option");
        optionItem.value = item.itemcode;
        optionItem.text = item.itemcode;
        dropdownItem.add(optionItem);
      });
    })
    .catch((error) => console.error("Error populating item options:", error));
}

populateItemOptions();

var itemIdDropDown = document.getElementById("itemIdDropDown");
var itemCodeField = document.getElementById("itemCodeField");
var itemNameField = document.getElementById("itemNameField");
var itemPriceField = document.getElementById("priceField");
var QtyOnHandField = document.getElementById("QtyOnHandField");
QtyOnHandField.readOnly = true;
itemCodeField.readOnly = true;
itemNameField.readOnly = true;
itemPriceField.readOnly = true;

itemIdDropDown.addEventListener("change", function () {
  var selectedItemId = itemIdDropDown.value;

  fetch(`http://localhost:8080/items/${selectedItemId}`)
    .then((response) => response.json())
    .then((item) => {
      if (item) {
        itemCodeField.value = item.itemcode;
        itemNameField.value = item.itemname;
        itemPriceField.value = item.unitprice;
        QtyOnHandField.value = item.qty;
      } else {
        alert("Item not found");
      }
    })
    .catch((error) => console.error("Error fetching item details:", error));
});

// ======================================add items to table===============================================================

var btnAddToCart = document.getElementById("addToCart");

btnAddToCart.addEventListener("click", (event) => {
  event.preventDefault();

  let itemCode = document.getElementById("itemCodeField").value;
  let itemName = document.getElementById("itemNameField").value;
  let price = parseFloat(document.getElementById("priceField").value);
  let orderQty = parseInt(document.getElementById("orderQtyField").value);
  let total = price * orderQty;

  fetch(`http://localhost:8080/cart/${itemCode}`)
    .then((response) => response.json())
    .then((existingCartItem) => {
      if (existingCartItem) {
        fetch(`http://localhost:8080/items/${itemCode}`)
          .then((response) => response.json())
          .then((item) => {
            if (item && item.qty >= orderQty) {
              existingCartItem.qty += orderQty;
              existingCartItem.total += total;
              item.qty -= orderQty;

              updateCartItem(existingCartItem);
              updateItemQty(item);
              updateCartTable();
              calculateTotal(document.getElementById("discountField").value);
            } else {
              alert("Insufficient quantity on hand.");
            }
          });
      } else {
        fetch(`http://localhost:8080/items/${itemCode}`)
          .then((response) => response.json())
          .then((item) => {
            if (item && checkQtyHand()) {
              let cartItem = {
                id: itemCode,
                name: itemName,
                unitPrice: price,
                qty: orderQty,
                total: total,
              };
              item.qty -= orderQty;
              addToCart(cartItem);
              updateItemQty(item);
              updateCartTable();
              calculateTotal(document.getElementById("discountField").value);
            }
          });
      }
    })
    .catch((error) => console.error("Error adding item to cart:", error));
});

function checkQtyHand() {
  let orderQty = parseInt(document.getElementById("orderQtyField").value);
  let QtyOnHand = parseInt(document.getElementById("QtyOnHandField").value);
  let isValid = true;

  if (isNaN(orderQty) || isNaN(QtyOnHand)) {
    document.getElementById("qtyError").textContent = "Please enter valid numbers";
    isValid = false;
  } else if (orderQty > QtyOnHand) {
    document.getElementById("qtyError").textContent = "Exceeded Qty On Hand";
    isValid = false;
  } else {
    document.getElementById("qtyError").textContent = "";
  }

  return isValid;
}

function updateCartTable() {
  var cartTable = document.getElementById("tblOrder");

  cartTable.innerHTML = `
    <tr>
      <th>Item Code</th>
      <th>Item Name</th>
      <th>Price</th>
      <th>Qty</th>
      <th>Total</th>
      <th>Actions</th>
    </tr>`;

  fetch("http://localhost:8080/cart")
    .then((response) => response.json())
    .then((cart) => {
      cart.forEach(function (cartItem) {
        cartTable.innerHTML += `
          <tr>
            <td>${cartItem.id}</td>
            <td>${cartItem.name}</td>
            <td>${cartItem.unitPrice}</td>
            <td>${cartItem.qty}</td>
            <td>${cartItem.total}</td>
            <td>
              <button class="delete" id="${cartItem.id}">Delete</button>
            </td>
          </tr>`;
      });
    })
    .catch((error) => console.error("Error updating cart table:", error));
}

function addToCart(cartItem) {
  fetch("http://localhost:8080/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cartItem),
  }).catch((error) => console.error("Error adding to cart:", error));
}

function updateCartItem(cartItem) {
  fetch(`http://localhost:8080/cart/${cartItem.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cartItem),
  }).catch((error) => console.error("Error updating cart item:", error));
}

function updateItemQty(item) {
  fetch(`http://localhost:8080/items/${item.itemcode}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  }).catch((error) => console.error("Error updating item quantity:", error));
}

// ==========================calculate total===============================================================

function calculateTotal(discount) {
  fetch("http://localhost:8080/cart")
    .then((response) => response.json())
    .then((cart) => {
      let subTotal = 0;
      cart.forEach((cartItem) => {
        subTotal += parseFloat(cartItem.total);
      });

      document.getElementById("subTotal").innerHTML = `<h1>SUB TOTAL: ${subTotal.toFixed(2)}</h1>`;
      let total = discount === "" || discount == null ? subTotal : subTotal * (1 - discount / 100);

      document.getElementById("total").innerText = total.toFixed(2);
    })
    .catch((error) => console.error("Error calculating total:", error));
}

function clearFields() {
  document.getElementById("itemCodeField").value = "";
  document.getElementById("itemNameField").value = "";
  document.getElementById("priceField").value = "";
  document.getElementById("QtyOnHandField").value = "";
  document.getElementById("orderQtyField").value = "";
}

document.getElementById("discountField").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    calculateTotal(document.getElementById("discountField").value);
  }
});

// ==========================calculate balance ===============================================================

let btnPurchase = document.getElementById("purchase");
btnPurchase.addEventListener("click", (event) => {
  event.preventDefault();
  calculateBalance();
});

function calculateBalance() {
  let cash = parseFloat(document.getElementById("cashField").value);
  let total = parseFloat(document.getElementById("total").innerText);
  let balanceField = document.getElementById("balanceField");

  balanceField.value = (cash - total).toFixed(2);
}

// ======================remove item from cart ==========================================================
function removeFromCart(itemId) {
  fetch(`http://localhost:8080/cart/${itemId}`, {
    method: "DELETE",
  })
    .then(() => {
      fetch(`http://localhost:8080/items/${itemId}`)
        .then((response) => response.json())
        .then((item) => {
          item.qty += parseInt(item.qty);
          updateItemQty(item);
        });

      updateCartTable();
      calculateTotal(document.getElementById("discountField").value);
    })
    .catch((error) => console.error("Error removing item from cart:", error));
}


// import { items, customers, cart, purchasedOrders } from "../db/db.js";

// // =========================place order form===================================

// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("orderIdField").value = generateOrderId();
//   document.getElementById("currentDate").value = getCurrentDate();
//   populateCustomerOptions();
//   populateItemOptions();
//   document.getElementById("orderQtyField").addEventListener("change", checkQtyHand);

//   document.getElementById("tblOrder").addEventListener("click", function (event) {
//     if (event.target.classList.contains("delete")) {
//       let itemId = event.target.id;
//       removeFromCart(itemId);
//     }
//   });
// });

// // ====================generate order id=================================================================

// function generateOrderId() {
//   if (purchasedOrders.length === 0) {
//     return "#001";
//   } else {
//     let lastOrderId = purchasedOrders[purchasedOrders.length - 1].id;
//     let nextOrderId = parseInt(lastOrderId.substring(1)) + 1;
//     return `#${String(nextOrderId).padStart(3, "0")}`;
//   }
// }

// function getCurrentDate() {
//   const date = new Date();
//   let day = date.getDate();
//   let month = date.getMonth() + 1;
//   let year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// }

// // ====================set customer drop box================================================================

// function populateCustomerOptions() {
//   let dropdown = document.getElementById("customerIdDropDown");
//   dropdown.innerHTML = "";

//   let defaultOption = document.createElement("option");
//   defaultOption.text = "Select a customer";
//   dropdown.add(defaultOption);

//   customers.forEach(function (customer) {
//     let option = document.createElement("option");
//     option.value = customer.id;
//     option.text = customer.id;
//     dropdown.add(option);
//   });
// }

// var customerIdDropDown = document.getElementById("customerIdDropDown");
// var customerIdField = document.getElementById("customerIdField");
// var customerNameField = document.getElementById("customerNameField");
// var salaryField = document.getElementById("salaryField");
// var addressField = document.getElementById("addressField");
// customerIdField.readOnly = true;
// customerNameField.readOnly = true;
// salaryField.readOnly = true;
// addressField.readOnly = true;

// customerIdDropDown.addEventListener("change", function () {
//   var selectedCustomerId = customerIdDropDown.value;
//   var selectedCustomer = customers.find(function (customer) {
//     return customer.id === selectedCustomerId;
//   });

//   if (selectedCustomer) {
//     customerIdField.value = selectedCustomer.id;
//     customerNameField.value = selectedCustomer.name;
//     salaryField.value = selectedCustomer.salary;
//     addressField.value = selectedCustomer.address;
//   } else {
//     alert("Customer not found");
//   }
// });

// // ====================set item drop box================================================================

// function populateItemOptions() {
//   let dropdownItem = document.getElementById("itemIdDropDown");
//   dropdownItem.innerHTML = "";

//   let defaultOptionItem = document.createElement("option");
//   defaultOptionItem.text = "Select an item";
//   defaultOptionItem.value = "";
//   dropdownItem.add(defaultOptionItem);

//   items.forEach(function (item) {
//     let optionItem = document.createElement("option");
//     optionItem.value = item.itemcode;
//     optionItem.text = item.itemcode;
//     dropdownItem.add(optionItem);
//   });
// }

// populateItemOptions();

// var itemIdDropDown = document.getElementById("itemIdDropDown");
// var itemCodeField = document.getElementById("itemCodeField");
// var itemNameField = document.getElementById("itemNameField");
// var itemPriceField = document.getElementById("priceField");
// var QtyOnHandField = document.getElementById("QtyOnHandField");
// QtyOnHandField.readOnly = true;
// itemCodeField.readOnly = true;
// itemNameField.readOnly = true;
// itemPriceField.readOnly = true;

// itemIdDropDown.addEventListener("change", function () {
//   var selectedItemId = itemIdDropDown.value;
//   var selectedItem = items.find(function (item) {
//     return item.itemcode === selectedItemId;
//   });

//   if (selectedItem) {
//     itemCodeField.value = selectedItem.itemcode;
//     itemNameField.value = selectedItem.itemname;
//     itemPriceField.value = selectedItem.unitprice;
//     QtyOnHandField.value = selectedItem.qty;
//   } else {
//     alert("Item not found");
//   }
// });

// // ======================================add items to table===============================================================

// var btnAddToCart = document.getElementById("addToCart");

// btnAddToCart.addEventListener("click", (event) => {
//   event.preventDefault();

//   let itemCode = document.getElementById("itemCodeField").value;
//   let itemName = document.getElementById("itemNameField").value;
//   let price = parseFloat(document.getElementById("priceField").value);
//   let orderQty = parseInt(document.getElementById("orderQtyField").value);
//   let total = price * orderQty;

//   let existingCartItem = cart.find((cartItem) => cartItem.id === itemCode);

//   if (existingCartItem) {
//     items.forEach((item) => {
//       if (item.itemcode === existingCartItem.id && item.qty !== 0) {
//         existingCartItem.qty += orderQty;
//         existingCartItem.total += total;
//         item.qty -= orderQty;
//         updateCartTable();
//         calculateTotal(document.getElementById("discountField").value);
//       }
//     });
//   } else {
//     items.forEach((item) => {
//       if (itemCode === item.itemcode) {
//         if (checkQtyHand()) {
//           let cartItem = {
//             id: itemCode,
//             name: itemName,
//             unitPrice: price,
//             qty: orderQty,
//             total: total,
//           };
//           item.qty -= orderQty;
//           cart.push(cartItem);

//           updateCartTable();
//           calculateTotal(document.getElementById("discountField").value);
//         }
//       }
//     });
//   }

//   clearFields();
// });

// function checkQtyHand() {
//   let orderQty = parseInt(document.getElementById("orderQtyField").value);
//   let QtyOnHand = parseInt(document.getElementById("QtyOnHandField").value);
//   let isValid = true;

//   if (isNaN(orderQty) || isNaN(QtyOnHand)) {
//     document.getElementById("qtyError").textContent = "Please enter valid numbers";
//     isValid = false;
//   } else if (orderQty > QtyOnHand) {
//     document.getElementById("qtyError").textContent = "Exceeded Qty On Hand";
//     isValid = false;
//   } else {
//     document.getElementById("qtyError").textContent = "";
//   }

//   return isValid;
// }

// function updateCartTable() {
//   var cartTable = document.getElementById("tblOrder");

//   cartTable.innerHTML = `
//     <tr>
//       <th>Item Code</th>
//       <th>Item Name</th>
//       <th>Price</th>
//       <th>Qty</th>
//       <th>Total</th>
//       <th>Actions</th>
//     </tr>`;

//   cart.forEach(function (cartItem, index) {
//     cartTable.innerHTML += `
//       <tr>
//         <td>${cartItem.id}</td>
//         <td>${cartItem.name}</td>
//         <td>${cartItem.unitPrice}</td>
//         <td>${cartItem.qty}</td>
//         <td>${cartItem.total}</td>
//         <td>
//           <button class="delete" id="${cartItem.id}">Delete</button>
//         </td>
//       </tr>`;
//   });

//   clearFields();
// }

// // ==========================calculate total===============================================================

// function calculateTotal(discount) {
//   let subTotal = 0;
//   cart.forEach((cartItem) => {
//     subTotal += parseFloat(cartItem.total);
//   });

//   document.getElementById("subTotal").innerHTML = `<h1>SUB TOTAL: ${subTotal.toFixed(2)}</h1>`;
//   let total = discount === "" || discount == null ? subTotal : subTotal * (1 - discount / 100);

//   document.getElementById("total").innerText = total.toFixed(2);
// }

// function clearFields() {
//   document.getElementById("itemCodeField").value = "";
//   document.getElementById("itemNameField").value = "";
//   document.getElementById("priceField").value = "";
//   document.getElementById("QtyOnHandField").value = "";
//   document.getElementById("orderQtyField").value = "";
// }

// document.getElementById("discountField").addEventListener("keydown", function (event) {
//   if (event.key === "Enter") {
//     event.preventDefault();
//     calculateTotal(document.getElementById("discountField").value);
//   }
// });

// // ==========================calculate balance ===============================================================

// let btnPurchase = document.getElementById("purchase");
// btnPurchase.addEventListener("click", (event) => {
//   event.preventDefault();
//   calculateBalance();
// });

// function calculateBalance() {
//   let cash = parseFloat(document.getElementById("cashField").value);
//   let total = parseFloat(document.getElementById("total").innerText);
//   let balanceField = document.getElementById("balanceField");

//   balanceField.value = (cash - total).toFixed(2);
// }

// // ======================remove item from cart ==========================================================
// function removeFromCart(itemId) {
//   let cartItemIndex = cart.findIndex(cartItem => cartItem.id === itemId);

//   if (cartItemIndex !== -1) {
//     let cartItem = cart[cartItemIndex];
//     let item = items.find(item => item.itemcode === cartItem.id);
//     if (item) {
//       item.qty += cartItem.qty;
//     }

//     cart.splice(cartItemIndex, 1);
//     updateCartTable();
//     calculateTotal(document.getElementById("discountField").value);
//   }
// }
