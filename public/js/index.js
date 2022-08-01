let newVisitor = false;
let getLocal = localStorage.getItem("new visitor");

if (!getLocal) {
  let resetDatabaseButton = document.querySelector(".reset-database-button");
  let modal = document.querySelector(".welcome-modal-window");
  modal.removeAttribute("hidden");
  resetDatabaseButton.addEventListener("click", () => {
    newVisitor = true;
    localStorage.setItem("new visitor", newVisitor);
    modal.setAttribute("hidden", "")
  })  
}
