const image_input = document.querySelector(".file-image-input");
const button = document.querySelector(".buton-file-image-input");
const icon = document.querySelector(".upload-image");

image_input.addEventListener("change", () => {
  if (image_input.files.length > 0) {
    button.style.background = "#39b54a";
    button.style.borderRadius = "40px";
    icon.src = "/img/check-input.svg";
  }
});
