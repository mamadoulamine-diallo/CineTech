
// *******************Script Burger Menu*******************
document.addEventListener("DOMContentLoaded", function () {
  const burger = document.querySelector(".hamburger-menu");
  const sidebar = document.getElementById("sidebar");

  burger.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
  });
});


