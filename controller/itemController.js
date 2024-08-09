document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("itemCode").value = generateItemId();
  let itemId = document.getElementById("itemCode");
  itemId.readOnly = true;
  updateItemCards();
});

// ==================Generate Item ID=========================================
function generateItemId() {
  fetch("http://localhost:8080/items")
    .then((response) => response.json())
    .then((items) => {
      var itemNumbers = items.map((item) => {
        return parseInt(item.itemcode.replace("I", ""), 10);
      });

      var maxNumber = itemNumbers.length > 0 ? Math.max(...itemNumbers) : 0;
      var newNumber = maxNumber + 1;
      var newId = "I" + String(newNumber).padStart(3, "0");
      document.getElementById("itemCode").value = newId;
    })
    .catch((error) => console.error("Error generating Item ID:", error));
}

const fileInput = document.getElementById("fileInput");
const fileChosen = document.getElementById("file-chosen");

fileInput.addEventListener("change", function () {
  fileChosen.textContent = this.files[0].name;
});

var itemCardsContainer = document.getElementById("itemCardsContainer");
var btnSaveItem = document.getElementById("btnSaveItem");

// =====================Save Item=============================================
btnSaveItem.addEventListener("click", function (event) {
  event.preventDefault();

  let itemCode = document.getElementById("itemCode").value;

  if (validateItem()) {
    let itemName = document.getElementById("itemName").value;
    let itemQty = document.getElementById("itemQty").value;
    let unitPrice = document.getElementById("unitPrice").value;
    let fileInput = document.getElementById("fileInput");
    let imageFile = fileInput.files[0];

    if (imageFile) {
      let reader = new FileReader();
      reader.onload = function (e) {
        let item = {
          itemcode: itemCode,
          itemname: itemName,
          qty: itemQty,
          unitprice: unitPrice,
          imageUrl: e.target.result,
        };

        fetch("http://localhost:8080/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        })
          .then((response) => response.json())
          .then(() => {
            clearItemFields();
            updateItemCards();
            populateItemOptions();
          })
          .catch((error) => console.error("Error saving item:", error));
      };
      reader.readAsDataURL(imageFile);
    } else {
      alert("Please select an image");
    }
  }
});

// ==================Update Item Cards========================================
function updateItemCards() {
  fetch("http://localhost:8080/items")
    .then((response) => response.json())
    .then((items) => {
      itemCardsContainer.innerHTML = "";
      items.forEach(function (item) {
        let itemCard = document.createElement("div");
        itemCard.className = "itemCard";
        itemCard.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.itemname}" />
          <p>Item Code: ${item.itemcode}</p>
          <p>Item Name: ${item.itemname}</p>
          <p>Item Qty: ${item.qty}</p>
          <p>Unit Price: ${item.unitprice}</p>
        `;
        itemCardsContainer.appendChild(itemCard);
      });
    })
    .catch((error) => console.error("Error updating item cards:", error));
}

// ==================Clear Fields============================================
function clearItemFields() {
  document.getElementById("itemCode").value = generateItemId();
  document.getElementById("itemName").value = "";
  document.getElementById("itemQty").value = "";
  document.getElementById("unitPrice").value = "";
  clearImageField();
}

function clearImageField() {
  fileInput.value = "";
  fileChosen.textContent = "No file chosen";
  imagePreview.src = "";
  imagePreview.style.display = "none";
}

// ==================Search Item=============================================
var searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetch(`http://localhost:8080/items/${searchInput.value}`)
      .then((response) => response.json())
      .then((item) => {
        if (item) {
          document.getElementById("itemCode").value = item.itemcode;
          document.getElementById("itemName").value = item.itemname;
          document.getElementById("itemQty").value = item.qty;
          document.getElementById("unitPrice").value = item.unitprice;
          imagePreview.src = item.imageUrl;
          imagePreview.style.display = "block";
        } else {
          alert("Item not found");
        }
      })
      .catch((error) => console.error("Error searching item:", error));
  }
});

// ==================Delete Item=============================================
var btnRemoveItem = document.getElementById("btnRemoveItem");
btnRemoveItem.addEventListener("click", (event) => {
  event.preventDefault();

  let itemId = document.getElementById("itemCode").value;

  fetch(`http://localhost:8080/items/${itemId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Item deleted");
        updateItemCards();
        clearImageField();
        clearItemFields();
      } else {
        alert("Item not found");
      }
    })
    .catch((error) => console.error("Error deleting item:", error));
});

// ==================Update Item=============================================
var btnUpdateItem = document.getElementById("btnUpdateItem");
btnUpdateItem.addEventListener("click", function (event) {
  event.preventDefault();

  let itemCode = document.getElementById("itemCode").value;
  let itemName = document.getElementById("itemName").value;
  let itemQty = document.getElementById("itemQty").value;
  let unitPrice = document.getElementById("unitPrice").value;
  let fileInput = document.getElementById("fileInput");
  let imageFile = fileInput.files[0];

  fetch(`http://localhost:8080/items/${itemCode}`)
    .then((response) => response.json())
    .then((item) => {
      if (item) {
        item.itemname = itemName;
        item.qty = itemQty;
        item.unitprice = unitPrice;

        if (imageFile) {
          let reader = new FileReader();
          reader.onload = function (e) {
            item.imageUrl = e.target.result;
            updateItem(item);
          };
          reader.readAsDataURL(imageFile);
        } else {
          updateItem(item);
        }
      } else {
        alert("Item not found");
      }
    })
    .catch((error) => console.error("Error updating item:", error));
});

function updateItem(item) {
  fetch(`http://localhost:8080/items/${item.itemcode}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then((response) => response.json())
    .then(() => {
      alert("Item updated");
      updateItemCards();
      clearItemFields();
    })
    .catch((error) => console.error("Error updating item:", error));
}

// ==================Validate Item===========================================
function validateItem() {
  let itemCodeValidate = document.getElementById("itemCode").value;
  let itemNameValidate = document.getElementById("itemName").value;
  let itemQtyValidate = document.getElementById("itemQty").value;
  let unitPriceValidate = document.getElementById("unitPrice").value;
  let isValid = true;

  if (!/^[a-zA-Z\s]+$/.test(itemNameValidate)) {
    document.getElementById("itemNameError").textContent =
      "Enter a valid name (letters and spaces only)";
    isValid = false;
  } else {
    document.getElementById("itemNameError").textContent = "";
  }

  if (itemQtyValidate === null || itemQtyValidate === "") {
    document.getElementById("itemQtyError").textContent = "Enter item Qty";
    isValid = false;
  } else {
    document.getElementById("itemQtyError").textContent = "";
  }

  if (!/^\d+(\.\d{1,2})?$/.test(unitPriceValidate)) {
    document.getElementById("unitPriceError").textContent =
      "Enter valid Unit Price";
    isValid = false;
  } else {
    document.getElementById("unitPriceError").textContent = "";
  }

  return isValid;
}

// ==================Get All Items===========================================
var getAllItems = document.getElementById("btnGetAllItems");

getAllItems.addEventListener("click", (event) => {
  event.preventDefault();
  updateItemCards();
});


// import { items } from "../db/db.js";

// // ===============================================item manage==========================================================================

// document.addEventListener("DOMContentLoaded", function () {
//   loadImage();
//   document.getElementById("itemCode").value = generateItemId();
//   let itemId = document.getElementById("itemCode");
//   itemId.readOnly = true;
//   updateItemCards();
// });

// // ==================generate itemID===========================================================
// function generateItemId() {
//   // Extract numeric part of customer IDs
//   var itemNumbers = items.map((item) => {
//     return parseInt(item.itemcode.replace("I", ""), 10);
//   });

//   // Find the highest number and increment it
//   var maxNumber = itemNumbers.length > 0 ? Math.max(...itemNumbers) : 0;
//   var newNumber = maxNumber + 1;

//   // Pad the number with leading zeros
//   var newId = "I" + String(newNumber).padStart(3, "0");
//   return newId;
// }

// const fileInput = document.getElementById("fileInput");
// const fileChosen = document.getElementById("file-chosen");

// fileInput.addEventListener("change", function () {
//   fileChosen.textContent = this.files[0].name;
// });

// var itemCardsContainer = document.getElementById("itemCardsContainer");
// var btnSaveItem = document.getElementById("btnSaveItem");

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
//         let item = {
//           itemcode: itemCode,
//           itemname: itemName,
//           qty: itemQty,
//           unitprice: unitPrice,
//           imageUrl: e.target.result,
//         };

//         items.push(item);
//         clearItemFields();
//         updateItemCards();
//         // updateItemCodeField();
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
//   document.getElementById("itemCode").value = generateItemId();
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

// function loadImage() {
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
//     clearImageField();
//     clearItemFields();
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

//   //   var itemIdPattern = /^I\d{2}-\d{3}$/;

//   //   if (!itemIdPattern.test(itemCodeValidate)) {
//   //     document.getElementById("itemCodeError").textContent =
//   //       "Item Code is a required field.Pattern I000";
//   //     isValid = false;
//   //   } else {
//   //     document.getElementById("itemCodeError").textContent = "";
//   //   }

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
// // =============================btn get all======================================================

