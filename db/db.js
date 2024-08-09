var cust;
var customers = [
  cust = {
  id: "C001",
  name: "Sami",
  address: "Galle",
  salary: "20000.00",
  },
    cust = {
  id: "C002",
  name: "Sachi",
  address: "Galle",
  salary: "20000.00",
  },
];


let item;
var items = [
  item = {
    itemcode: "I001",
    itemname: "Samadhi",
    qty: "200",
    unitprice: "10.00",
    imageUrl:"assests/25638441_7087687.jpg",
  },
  item = {
    itemcode: "I002",
    itemname: "Samadhi",
    qty: "100",
    unitprice: "10.00",
    imageUrl:"assests/25638443_7087714.jpg",
  },
];
let cart = [];
let purchasedOrders = [];

export { customers, items, cart, purchasedOrders };  



// // ==================generate custID===========================================================
// function generateCustomerId() {
//   // Extract numeric part of customer IDs
//   var customerNumbers = customers.map((cust) => {
//     return parseInt(cust.id.replace("C", ""), 10);
//   });

//   // Find the highest number and increment it
//   var maxNumber = customerNumbers.length > 0 ? Math.max(...customerNumbers) : 0;
//   var newNumber = maxNumber + 1;

//   // Pad the number with leading zeros
//   var newId = "C" + String(newNumber).padStart(3, "0");
//   return newId;
// }

// // ===============================================save customer===========================================

// var btnSave = document.getElementById("btnSave");

// btnSave.addEventListener("click", function (event) {
//   event.preventDefault();

//   let custId = document.getElementById("custId").value;
//   let custName = document.getElementById("custName").value;
//   let custAddress = document.getElementById("custAddress").value;
//   let custSalary = document.getElementById("custSalary").value;

//   if (validateCustomer()) {
//       cust = {
//       id: custId,
//       name: custName,
//       address: custAddress,
//       salary: custSalary,
//     };

//     customers.push(cust);
//     clearFields();
//     updateTable();
//     populateCustomerOptions(); // Update datalist options
//     generateCustomerId();
//   }
// });

// //  ======================update customer table======================================================

// function updateTable() {
//   customerTable.innerHTML = `
//     <tr>
//       <th>Customer Id</th>
//       <th>Customer Name</th>
//       <th>Customer Address</th>
//       <th>Customer Salary</th>
//     </tr>`;

//   customers.forEach(function (cust) {
//     customerTable.innerHTML += `<tr>
//       <td>${cust.id}</td>
//       <td>${cust.name}</td>
//       <td>${cust.address}</td>
//       <td>${cust.salary}</td>
//     </tr>`;
//   });

//   applyEvenRowStyling();
// }

// function applyEvenRowStyling() {
//   var rows = customerTable.getElementsByTagName("tr");
//   for (var i = 1; i < rows.length; i++) {
//     // Start from 1 to skip the header row
//     if (i % 2 === 0) {
//       rows[i].style.backgroundColor = "#dddddd";
//     } else {
//       rows[i].style.backgroundColor = "#ffffff"; // Ensure odd rows have a white background
//     }
//   }
// }

// // =================================validate customer===================================================

// function validateCustomer() {
//   let custIdValidate = document.getElementById("custId").value;
//   let custNameValidate = document.getElementById("custName").value;
//   let custAddressValidate = document.getElementById("custAddress").value;
//   let custSalaryValidate = document.getElementById("custSalary").value;
//   let isValid = true; // Define isValid variable inside the function

//   // Regular expression to validate customer ID pattern C00-000
//   var customerIdPattern = /^C\d{2}-\d{3}$/;

//   if (!customerIdPattern.test(custIdValidate)) {
//     document.getElementById("custIdError").textContent =
//       "Customer ID is a required field.Pattern C00-000";
//     isValid = false;
//   } else {
//     document.getElementById("custIdError").textContent = "";
//   }

//   if (!/^[a-zA-Z\s]+$/.test(custNameValidate)) {
//     document.getElementById("custNameError").textContent =
//       "Please enter a valid name (letters and spaces only)";
//     isValid = false;
//   } else {
//     document.getElementById("custNameError").textContent = "";
//   }

//   if (custAddressValidate === null || custAddressValidate === "") {
//     document.getElementById("custAddressError").textContent =
//       "Please enter your address";
//     isValid = false;
//   } else {
//     document.getElementById("custAddressError").textContent = "";
//   }

//   if (!/^\d+(\.\d{1,2})?$/.test(custSalaryValidate)) {
//     document.getElementById("custSalaryError").textContent =
//       "Please enter a valid salary (positive number, up to 2 decimal places)";
//     isValid = false;
//   } else {
//     document.getElementById("custSalaryError").textContent = "";
//   }

//   // Return the isValid flag
//   return isValid;
// }

// function clearFields() {
//   document.getElementById("custId").value = generateCustomerId();
//   document.getElementById("custName").value = "";
//   document.getElementById("custAddress").value = "";
//   document.getElementById("custSalary").value = "";
// }

// // ==============================================get all===============================================
// var btnGetAll = document.getElementById("btnGetAll");
// btnGetAll.addEventListener("click", function (event) {
//   event.preventDefault();
//   updateTable();
// });

// // ============================================search=======================================================
// var searchCust = document.getElementById("searchId");
// searchCust.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     let customer = customers.find(function (cust) {
//       return cust.id === searchCust.value;
//     });

//     if (customer) {
//       document.getElementById("custId").value = customer.id;
//       document.getElementById("custName").value = customer.name;
//       document.getElementById("custAddress").value = customer.address;
//       document.getElementById("custSalary").value = customer.salary;
//       // setInputsReadOnly(true);
//     } else {
//       alert("Customer not found");
//     }
//   }
// });
// // ===================================================delete================================================
// var btnRemove = document.getElementById("btnRemove");
// btnRemove.addEventListener("click", function (event) {
//   event.preventDefault();

//   let custId = document.getElementById("custId").value;

//   let index = customers.findIndex(function (cust) {
//     return cust.id === custId;
//   });

//   if (index !== -1) {
//     customers.splice(index, 1);
//     updateTable();
//     document.getElementById("custId").value = "";
//     document.getElementById("custName").value = "";
//     document.getElementById("custAddress").value = "";
//     document.getElementById("custSalary").value = "";
//   } else {
//     alert("Customer not found");
//   }
// });

// function setInputsReadOnly(readOnly) {
//   document.getElementById("custId").readOnly = readOnly;
// }

// // =================================update customer=====================================================

// var updateCustomer = document.getElementById("btnUpdate");
// updateCustomer.addEventListener("click", function (event) {
//   event.preventDefault();
//   let custId = document.getElementById("custId").value;
//   let custName = document.getElementById("custName").value;
//   let custAddress = document.getElementById("custAddress").value;
//   let custSalary = document.getElementById("custSalary").value;

//   let customer = customers.find(function (cust) {
//     return cust.id === custId;
//   });

//   if (customer) {
//     customer.name = custName;
//     customer.address = custAddress;
//     customer.salary = custSalary;
//     alert("Customer updated");
//     clearFields();
//     updateTable();
//     updateCustomerIdField();
//   } else {
//     alert("Customer not found");
//   }
// });
// // ===============================================item manage==========================================================================

// const fileInput = document.getElementById("fileInput");
// const fileChosen = document.getElementById("file-chosen");

// fileInput.addEventListener("change", function () {
//   fileChosen.textContent = this.files[0].name;
// });

// var itemCardsContainer = document.getElementById("itemCardsContainer");
// var btnSaveItem = document.getElementById("btnSaveItem");

// // ==================generate item code===============================================================================================

// function generateItemCode() {
//   lastItemCode += 1;
//   let itemCodeStr = lastItemCode.toString().padStart(3, "0");
//   return `I00-${itemCodeStr}`;
// }

// function updateItemCodeField() {
//   document.getElementById("itemCode").value = generateItemCode();
// }
// // =====================save item==================================================================

// btnSaveItem.addEventListener("click", function (event) {
//   event.preventDefault();

//   let itemCode = document.getElementById("itemCode").value;

//   if (validateItem()) {
//     let itemName = document.getElementById("itemName").value;
//     let itemQty = document.getElementById("itemQty").value;
//     let unitPrice = document.getElementById("unitPrice").value;
//     let fileInput = document.getElementById("fileInput");
//     let imageFile = fileInput.files[0];

//     if (imageFile) {
//       let reader = new FileReader();
//       reader.onload = function (e) {
//         item = {
//           itemcode: itemCode, // Use correct property name
//           itemname: itemName, // Use correct property name
//           qty: itemQty, // Use correct property name
//           unitprice: unitPrice, // Use correct property name
//           imageUrl: e.target.result,
//         };

//         items.push(item);
//         clearItemFields();
//         updateItemCards();
//         updateItemCodeField();
//         populateItemOptions();
//       };
//       reader.readAsDataURL(imageFile);
//     } else {
//       alert("Please select an image");
//     }
//   }
// });

// // ===============================================update item cards=======================================

// function updateItemCards() {
//   itemCardsContainer.innerHTML = "";
//   items.forEach(function (item) {
//     let itemCard = document.createElement("div");
//     itemCard.className = "itemCard";
//     itemCard.innerHTML = `
//       <img src="${item.imageUrl}" alt="${item.itemname}" />
//       <p>Item Code: ${item.itemcode}</p>
//       <p>Item Name: ${item.itemname}</p>
//       <p>Item Qty: ${item.qty}</p>
//       <p>Unit Price: ${item.unitprice}</p>
//     `;
//     itemCardsContainer.appendChild(itemCard);
//   });
// }
// // ============================clear fields===========================================================

// function clearItemFields() {
//   document.getElementById("itemCode").value = "";
//   document.getElementById("itemName").value = "";
//   document.getElementById("itemQty").value = "";
//   document.getElementById("unitPrice").value = "";
//   clearImageField();
// }

// function clearImageField() {
//   fileInput.value = "";
//   fileChosen.textContent = "No file chosen";
//   imagePreview.src = "";
//   imagePreview.style.display = "none";
// }

// // ============================search item===========================================================

// var searchInput = document.getElementById("searchInput");
// searchInput.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     let findItem = items.find(function (item) {
//       return item.itemcode === searchInput.value;
//     });

//     if (findItem) {
//       document.getElementById("itemCode").value = findItem.itemcode;
//       document.getElementById("itemName").value = findItem.itemname;
//       document.getElementById("itemQty").value = findItem.qty;
//       document.getElementById("unitPrice").value = findItem.unitprice;
//       imagePreview.src = findItem.imageUrl;
//       imagePreview.style.display = "block";
//       // setItemIdReadOnly(true);
//     } else {
//       alert("item can not find");
//     }
//   }
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const fileInput = document.getElementById("fileInput");
//   const fileChosen = document.getElementById("file-chosen");
//   const imagePreview = document.getElementById("imagePreviewImg");

//   fileInput.addEventListener("change", function () {
//     const file = this.files[0];
//     fileChosen.textContent = file ? file.name : "No file chosen";

//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         imagePreview.src = e.target.result;
//         imagePreview.style.display = "block";
//         imagePreview.style.height = "200px";
//         imagePreview.style.objectFit = "cover";
//       };
//       reader.readAsDataURL(file);
//     } else {
//       imagePreview.src = "";
//       imagePreview.style.display = "none";
//     }
//   });
// });

// function setItemIdReadOnly(readOnly) {
//   document.getElementById("itemCode").readOnly = readOnly;
// }

// // ====================================delete item=================================================================

// var btnRemoveItem = document.getElementById("btnRemoveItem");
// btnRemoveItem.addEventListener("click", (event) => {
//   event.preventDefault();

//   let itemId = document.getElementById("itemCode").value;

//   let itemIdIndex = items.findIndex(function (item) {
//     return item.itemcode === itemId;
//   });

//   if (itemIdIndex !== -1) {
//     items.splice(itemIdIndex, 1);
//     updateItemCards();
//     document.getElementById("itemCode").value = "";
//     document.getElementById("itemName").value = "";
//     document.getElementById("itemQty").value = "";
//     document.getElementById("unitPrice").value = "";
//     clearImageField();
//   } else {
//     alert("item not found");
//   }
// });

// // ====================================update item=================================================================

// var btnUpdateItem = document.getElementById("btnUpdateItem");
// btnUpdateItem.addEventListener("click", function (event) {
//   event.preventDefault();

//   let itemCode = document.getElementById("itemCode").value;
//   let itemName = document.getElementById("itemName").value;
//   let itemQty = document.getElementById("itemQty").value;
//   let unitPrice = document.getElementById("unitPrice").value;
//   let fileInput = document.getElementById("fileInput");
//   let imageFile = fileInput.files[0];

//   let itemToUpdateIndex = items.findIndex(function (item) {
//     return item.itemcode === itemCode;
//   });

//   if (itemToUpdateIndex !== -1) {
//     // Update other item properties
//     items[itemToUpdateIndex].itemname = itemName;
//     items[itemToUpdateIndex].qty = itemQty;
//     items[itemToUpdateIndex].unitprice = unitPrice;

//     // If image file is selected, update image
//     if (imageFile) {
//       let reader = new FileReader();
//       reader.onload = function (e) {
//         items[itemToUpdateIndex].imageUrl = e.target.result;
//         // Update image preview
//         document.getElementById("imagePreviewImg").src = e.target.result;
//         document.getElementById("imagePreviewImg").style.display = "block";
//         updateItemCards(); // Update item cards after image is updated
//       };
//       reader.readAsDataURL(imageFile);
//     } else {
//       updateItemCards(); // Update item cards if no image is updated
//     }

//     alert("Item updated");
//     clearItemFields();
//     updateItemCodeField();
//   } else {
//     alert("Item not found");
//   }
// });

// // =========================validate item==========================================================

// function validateItem() {
//   let itemCodeValidate = document.getElementById("itemCode").value;
//   let itemNameValidate = document.getElementById("itemName").value;
//   let itemQtyValidate = document.getElementById("itemQty").value;
//   let unitPriceValidate = document.getElementById("unitPrice").value;
//   let isValid = true; // Define isValid variable inside the function

//   var itemIdPattern = /^I\d{2}-\d{3}$/;

//   if (!itemIdPattern.test(itemCodeValidate)) {
//     document.getElementById("itemCodeError").textContent =
//       "Item Code is a required field.Pattern I00-000";
//     isValid = false;
//   } else {
//     document.getElementById("itemCodeError").textContent = "";
//   }

//   if (!/^[a-zA-Z\s]+$/.test(itemNameValidate)) {
//     document.getElementById("itemNameError").textContent =
//       "Enter a valid name (letters and spaces only)";
//     isValid = false;
//   } else {
//     document.getElementById("itemNameError").textContent = "";
//   }

//   if (itemQtyValidate === null || itemQtyValidate === "") {
//     document.getElementById("itemQtyError").textContent = "Enter item Qty ";
//     isValid = false;
//   } else {
//     document.getElementById("itemQtyError").textContent = "";
//   }

//   if (!/^\d+(\.\d{1,2})?$/.test(unitPriceValidate)) {
//     document.getElementById("unitPriceError").textContent =
//       "Enter valid Unit Price";
//     isValid = false;
//   } else {
//     document.getElementById("unitPriceError").textContent = "";
//   }

//   // Return the isValid flag
//   return isValid;
// }
// // =========================place order form===================================

// // ====================generate order id=========================================

// function generateOrderId() {
//   lastOrderId += 1;
//   let orderIdStr = lastOrderId.toString().padStart(3, "0");
//   return `O00-${orderIdStr}`;
// }

// function updateOrderIdField() {
//   document.getElementById("orderIdField").value = generateOrderId();
// }

// // ====================set customer drop box=========================================

// // Assuming this is where you want to populate the dropdown (based on your provided HTML)
// var dropdown = document.getElementById("customerIdDropDown");

// // Function to populate customer dropdown
// function populateCustomerOptions() {
//   // Clear existing options
//   dropdown.innerHTML = "";

//   // Add a default option (if needed)
//   var defaultOption = document.createElement("option");
//   defaultOption.text = "Select a customer";
//   dropdown.add(defaultOption);

//   // Add options based on customers array
//   customers.forEach(function (customer) {
//     var option = document.createElement("option");
//     option.value = customer.id; // Set the value attribute
//     option.text = customer.id; // Set the text content
//     dropdown.add(option);
//   });
// }

// // Call the function to initially populate the dropdown
// populateCustomerOptions();

// // Assuming these are the field IDs in your HTML
// var customerIdDropDown = document.getElementById("customerIdDropDown");
// var customerIdField = document.getElementById("customerIdField");
// var customerNameField = document.getElementById("customerNameField");
// var salaryField = document.getElementById("salaryField");
// var addressField = document.getElementById("addressField");

// // Event listener for dropdown change
// customerIdDropDown.addEventListener("change", function () {
//   var selectedCustomerId = customerIdDropDown.value;

//   // Find the selected customer in the customers array
//   var selectedCustomer = customers.find(function (customer) {
//     return customer.id === selectedCustomerId;
//   });

//   // If customer is found, update the fields
//   if (selectedCustomer) {
//     customerIdField.value = selectedCustomer.id;
//     customerNameField.value = selectedCustomer.name;
//     salaryField.value = selectedCustomer.salary;
//     addressField.value = selectedCustomer.address;
//   } else {
//     // Handle case where customer is not found (optional)
//     alert("Customer not found");
//   }
// });

// // ====================set item drop box=========================================

// function populateItemOptions() {
//   var dropdownItem = document.getElementById("itemIdDropDown");
//   dropdownItem.innerHTML = ""; // Clear existing options

//   var defaultOptionItem = document.createElement("option");
//   defaultOptionItem.text = "Select an item";
//   defaultOptionItem.value = ""; // Ensure the default option has an empty value
//   dropdownItem.add(defaultOptionItem);

//   items.forEach(function (item) {
//     var optionItem = document.createElement("option");
//     optionItem.value = item.itemcode; // Use correct property name
//     optionItem.text = item.itemcode; // Use correct property name
//     dropdownItem.add(optionItem);
//   });
// }

// // Call the function to initially populate the dropdown
// populateItemOptions();

// var itemIdDropDown = document.getElementById("itemIdDropDown");
// var itemCodeField = document.getElementById("itemCodeField");
// var itemNameField = document.getElementById("itemNameField");
// var itemPriceField = document.getElementById("priceField");
// var QtyOnHandField = document.getElementById("QtyOnHandField");

// // Event listener for dropdown change
// itemIdDropDown.addEventListener("change", function () {
//   var selectedItemId = itemIdDropDown.value;

//   // Find the selected item in the items array
//   var selectedItem = items.find(function (item) {
//     return item.itemcode === selectedItemId;
//   });

//   // If item is found, update the fields
//   if (selectedItem) {
//     itemCodeField.value = selectedItem.itemcode; // Update item code field
//     itemNameField.value = selectedItem.itemname; // Update item name field
//     itemPriceField.value = selectedItem.unitprice; // Update item price field
//     QtyOnHandField.value = selectedItem.qty; // Update quantity on hand field
//   } else {
//     // Handle case where item is not found (optional)
//     alert("Item not found");
//   }
// });

// // ======================================add items to table===============================================================

// var btnAddItem = document.getElementById("addItem");

// var AddItemArray = [];

// var additem = {};
// btnAddItem.addEventListener("click", (event) => {
//   event.preventDefault();
//   calculaterTotal();
// });

// // ==========================calculate total===============================================================

// function calculaterTotal() {
//   let price = document.getElementById("priceField");
//   let buyQty = document.getElementById("orderQtyField");
//   let subTotalField = document.getElementById("subTotal");

//   // subTotalField = price.value * buyQty.value;

//   subTotalField.innerHTML = `<h1>Sub Total :${price.value * buyQty.value}</h1>`;
// }

// // ==========================update qtyOnHand===============================================================
