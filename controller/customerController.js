// Assuming customers is initially an empty array
let customers = [];

// ==================Document Ready============================
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("custId").value = generateCustomerId();
  let custId = document.getElementById("custId");
  custId.readOnly = true;
  updateTable();
});

// ==================Generate Customer ID=======================
function generateCustomerId() {
  let customerNumbers = customers.map((cust) => {
    return parseInt(cust.id.replace("C", ""), 10);
  });

  let maxNumber = customerNumbers.length > 0 ? Math.max(...customerNumbers) : 0;
  let newNumber = maxNumber + 1;
  let newId = "C" + String(newNumber).padStart(3, "0");
  return newId;
}

// ==================Save Customer===============================
var btnSave = document.getElementById("btnSave");
btnSave.addEventListener("click", function (event) {
  event.preventDefault();

  let custId = document.getElementById("custId").value;
  let custName = document.getElementById("custName").value;
  let custAddress = document.getElementById("custAddress").value;
  let custSalary = document.getElementById("custSalary").value;

  if (validateCustomer()) {
    let cust = {
      id: custId,
      name: custName,
      address: custAddress,
      salary: custSalary,
    };

    fetch("http://localhost:8080/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cust),
    })
      .then((response) => response.json())
      .then((data) => {
        clearFields();
        updateTable();
      })
      .catch((error) => console.error("Error:", error));
  }
});

// ==================Update Customer Table=========================
function updateTable() {
  fetch("http://localhost:8080/customers")
    .then((response) => response.json())
    .then((data) => {
      customers = data;
      let customerTable = document.getElementById("customerTable");
      customerTable.innerHTML = `
        <tr>
          <th>Customer Id</th>
          <th>Customer Name</th>
          <th>Customer Address</th>
          <th>Customer Salary</th>
        </tr>`;

      customers.forEach(function (cust) {
        customerTable.innerHTML += `<tr>
          <td>${cust.id}</td>
          <td>${cust.name}</td>
          <td>${cust.address}</td>
          <td>${cust.salary}</td>
        </tr>`;
      });

      applyEvenRowStyling();
    })
    .catch((error) => console.error("Error:", error));
}

function applyEvenRowStyling() {
  var rows = customerTable.getElementsByTagName("tr");
  for (var i = 1; i < rows.length; i++) {
    if (i % 2 === 0) {
      rows[i].style.backgroundColor = "#dddddd";
    } else {
      rows[i].style.backgroundColor = "#ffffff";
    }
  }
}

// ==================Validate Customer=============================
function validateCustomer() {
  let custIdValidate = document.getElementById("custId").value;
  let custNameValidate = document.getElementById("custName").value;
  let custAddressValidate = document.getElementById("custAddress").value;
  let custSalaryValidate = document.getElementById("custSalary").value;
  let isValid = true;

  var customerIdPattern = /^C\d{3}$/;

  if (!customerIdPattern.test(custIdValidate)) {
    document.getElementById("custIdError").textContent =
      "Customer ID is a required field. Pattern C000";
    isValid = false;
  } else {
    document.getElementById("custIdError").textContent = "";
  }

  if (!/^[a-zA-Z\s]+$/.test(custNameValidate)) {
    document.getElementById("custNameError").textContent =
      "Please enter a valid name (letters and spaces only)";
    isValid = false;
  } else {
    document.getElementById("custNameError").textContent = "";
  }

  if (custAddressValidate === null || custAddressValidate === "") {
    document.getElementById("custAddressError").textContent =
      "Please enter your address";
    isValid = false;
  } else {
    document.getElementById("custAddressError").textContent = "";
  }

  if (!/^\d+(\.\d{1,2})?$/.test(custSalaryValidate)) {
    document.getElementById("custSalaryError").textContent =
      "Please enter a valid salary (positive number, up to 2 decimal places)";
    isValid = false;
  } else {
    document.getElementById("custSalaryError").textContent = "";
  }

  return isValid;
}

function clearFields() {
  document.getElementById("custId").value = generateCustomerId();
  document.getElementById("custName").value = "";
  document.getElementById("custAddress").value = "";
  document.getElementById("custSalary").value = "";
}

// ==================Get All Customers==============================
var btnGetAll = document.getElementById("btnGetAll");
btnGetAll.addEventListener("click", function (event) {
  event.preventDefault();
  updateTable();
});

// ==================Search Customer by ID==========================
var searchCust = document.getElementById("searchId");
searchCust.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetch(`http://localhost:8080/customers/${searchCust.value}`)
      .then((response) => response.json())
      .then((customer) => {
        if (customer) {
          document.getElementById("custId").value = customer.id;
          document.getElementById("custName").value = customer.name;
          document.getElementById("custAddress").value = customer.address;
          document.getElementById("custSalary").value = customer.salary;
        } else {
          alert("Customer not found");
        }
      })
      .catch((error) => console.error("Error:", error));
  }
});

// ==================Delete Customer===============================
var btnRemove = document.getElementById("btnRemove");
btnRemove.addEventListener("click", function () {
  let custId = document.getElementById("custId").value;

  fetch(`http://localhost:8080/customers/${custId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Customer deleted");
        updateTable();
        clearFields();
      } else {
        alert("Customer not found");
      }
    })
    .catch((error) => console.error("Error:", error));
});

// ==================Update Customer===============================
var updateCustomer = document.getElementById("btnUpdate");
updateCustomer.addEventListener("click", function (event) {
  event.preventDefault();

  let custId = document.getElementById("custId").value;
  let custName = document.getElementById("custName").value;
  let custAddress = document.getElementById("custAddress").value;
  let custSalary = document.getElementById("custSalary").value;

  let customer = {
    name: custName,
    address: custAddress,
    salary: custSalary,
  };

  fetch(`http://localhost:8080/customers/${custId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Customer updated");
      clearFields();
      updateTable();
    })
    .catch((error) => console.error("Error:", error));
});


// import { customers } from "../db/db.js";

// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("custId").value = generateCustomerId();
//   let custId = document.getElementById("custId");
//   custId.readOnly = true;
//   updateTable();
// });

// var customerTable = document.getElementById("customerTable");

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
//   return newId;
// }
// // ===============================================save customer===========================================


// btnSave.addEventListener("click", function (event) {
//   event.preventDefault();

//   let custId = document.getElementById("custId").value;
//   let custName = document.getElementById("custName").value;
//   let custAddress = document.getElementById("custAddress").value;
//   let custSalary = document.getElementById("custSalary").value;

//   if (validateCustomer()) {
//     let cust = {
//       id: custId,
//       name: custName,
//       address: custAddress,
//       salary: custSalary,
//     };

//     fetch("http://localhost:8080/customers", { // Replace with your backend URL
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(cust)
//     })
//     .then(response => response.json())
//     .then(data => {
//       clearFields();
//       updateTable(); // You might need to fetch the updated list
//     })
//     .catch(error => console.error('Error:', error));
//   }
// });


// //  ======================update customer table======================================================

// // function updateTable() {
// //   customerTable.innerHTML = `
// //     <tr>
// //       <th>Customer Id</th>
// //       <th>Customer Name</th>
// //       <th>Customer Address</th>
// //       <th>Customer Salary</th>
// //     </tr>`;

// //   customers.forEach(function (cust) {
// //     customerTable.innerHTML += `<tr>
// //       <td>${cust.id}</td>
// //       <td>${cust.name}</td>
// //       <td>${cust.address}</td>
// //       <td>${cust.salary}</td>
// //     </tr>`;
// //   });

// //   applyEvenRowStyling();
// // }

// // function applyEvenRowStyling() {
// //   var rows = customerTable.getElementsByTagName("tr");
// //   for (var i = 1; i < rows.length; i++) {
// //     // Start from 1 to skip the header row
// //     if (i % 2 === 0) {
// //       rows[i].style.backgroundColor = "#dddddd";
// //     } else {
// //       rows[i].style.backgroundColor = "#ffffff"; // Ensure odd rows have a white background
// //     }
// //   }
// // }
// updateCustomer.addEventListener("click", function (event) {
//   event.preventDefault();

//   let custId = document.getElementById("custId").value;
//   let custName = document.getElementById("custName").value;
//   let custAddress = document.getElementById("custAddress").value;
//   let custSalary = document.getElementById("custSalary").value;

//   let customer = {
//     name: custName,
//     address: custAddress,
//     salary: custSalary
//   };

//   fetch(`http://localhost:8080/customers/${custId}`, { // Replace with your backend URL
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(customer)
//   })
//   .then(response => response.json())
//   .then(data => {
//     alert("Customer updated");
//     clearFields();
//     updateTable(); // Fetch updated customer list
//   })
//   .catch(error => console.error('Error:', error));
// });

// // =================================validate customer===================================================

// function validateCustomer() {
//   let custIdValidate = document.getElementById("custId").value;
//   let custNameValidate = document.getElementById("custName").value;
//   let custAddressValidate = document.getElementById("custAddress").value;
//   let custSalaryValidate = document.getElementById("custSalary").value;
//   let isValid = true; // Define isValid variable inside the function

//   // Regular expression to validate customer ID pattern C00-000
//   var customerIdPattern = /^C\d{3}$/;

//   if (!customerIdPattern.test(custIdValidate)) {
//     document.getElementById("custIdError").textContent =
//       "Customer ID is a required field.Pattern C000";
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
// // var btnGetAll = document.getElementById("btnGetAll");
// // btnGetAll.addEventListener("click", function (event) {
// //   event.preventDefault();
// //   updateTable();
// // });

// function updateTable() {
//   fetch("http://localhost:8080/customers") // Replace with your backend URL
//     .then(response => response.json())
//     .then(customers => {
//       customerTable.innerHTML = `
//         <tr>
//           <th>Customer Id</th>
//           <th>Customer Name</th>
//           <th>Customer Address</th>
//           <th>Customer Salary</th>
//         </tr>`;

//       customers.forEach(function (cust) {
//         customerTable.innerHTML += `<tr>
//           <td>${cust.id}</td>
//           <td>${cust.name}</td>
//           <td>${cust.address}</td>
//           <td>${cust.salary}</td>
//         </tr>`;
//       });

//       applyEvenRowStyling();
//     })
//     .catch(error => console.error('Error:', error));
// }


// // ============================================search=======================================================
// // var searchCust = document.getElementById("searchId");
// // searchCust.addEventListener("keydown", (event) => {
// //   if (event.key === "Enter") {
// //     let customer = customers.find(function (cust) {
// //       return cust.id === searchCust.value;
// //     });

// //     if (customer) {
// //       document.getElementById("custId").value = customer.id;
// //       document.getElementById("custName").value = customer.name;
// //       document.getElementById("custAddress").value = customer.address;
// //       document.getElementById("custSalary").value = customer.salary;
// //       // setInputsReadOnly(true);
// //     } else {
// //       alert("Customer not found");
// //     }
// //   }
// // });

// searchCust.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     fetch(`http://localhost:8080/customers/${searchCust.value}`) // Replace with your backend URL
//       .then(response => response.json())
//       .then(customer => {
//         if (customer) {
//           document.getElementById("custId").value = customer.id;
//           document.getElementById("custName").value = customer.name;
//           document.getElementById("custAddress").value = customer.address;
//           document.getElementById("custSalary").value = customer.salary;
//         } else {
//           alert("Customer not found");
//         }
//       })
//       .catch(error => console.error('Error:', error));
//   }
// });

// // ===================================================delete================================================
// // var btnRemove = document.getElementById("btnRemove");
// // btnRemove.addEventListener("click", function () {
// //   //   event.preventDefault();

// //   let custId = document.getElementById("custId").value;

// //   let index = customers.findIndex(function (cust) {
// //     return cust.id === custId;
// //   });

// //   if (index !== -1) {
// //     customers.splice(index, 1);
// //     updateTable();
// //     clearFields();
// //   } else {
// //     alert("Customer not found");
// //   }
// // });

// btnRemove.addEventListener("click", function () {
//   let custId = document.getElementById("custId").value;

//   fetch(`http://localhost:8080/customers/${custId}`, { // Replace with your backend URL
//     method: "DELETE"
//   })
//   .then(response => {
//     if (response.ok) {
//       alert("Customer deleted");
//       updateTable();
//       clearFields();
//     } else {
//       alert("Customer not found");
//     }
//   })
//   .catch(error => console.error('Error:', error));
// });


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
//   } else {
//     alert("Customer not found");
//   }
// });
