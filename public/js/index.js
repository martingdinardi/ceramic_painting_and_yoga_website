let oldVisitor = localStorage.getItem("old visitor");
let modal = document.querySelector(".welcome-modal-container");

if (!oldVisitor) {
  let resetDatabaseButton = document.querySelector(".reset-database-button");
  modal.removeAttribute("hidden");
  document.body.style.overflow = "hidden"
  resetDatabaseButton.addEventListener("click", () => {
    oldVisitor = true;
    localStorage.setItem("old visitor", oldVisitor);
    modal.setAttribute("hidden", "")
    document.body.style.overflow = "auto"
  })  
} 