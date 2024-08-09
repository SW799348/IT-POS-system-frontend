
// Initialize the page by generating the first customer ID
window.onload = function () {
   
    
   
};
  
// =============================nav bar responsive======================================================
document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menuIcon");
    const closeIcon = document.getElementById("closeIcon");
    const responsiveNav = document.querySelector(".responsiveNav ul");
    
  
    menuIcon.addEventListener("click", () => {
      responsiveNav.style.display = "flex";
      menuIcon.style.display = "none";
      closeIcon.style.display = "block";
    });
  
    closeIcon.addEventListener("click", () => {
      responsiveNav.style.display = "none";
      closeIcon.style.display = "none";
      menuIcon.style.display = "block";
    });
  });
  