/* console.log("editando post js archivo"); */
const input = document.querySelector(".file-input");
const preview_image = document.querySelector(".preview-image");

input.addEventListener("change", () => {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      preview_image.src = `${reader.result}`;
    });

    reader.readAsDataURL(file);
  }
});
