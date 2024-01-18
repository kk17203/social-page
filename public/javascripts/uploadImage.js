// File Selection on post
document.getElementById("image").addEventListener("change", function () {
    const label = document.getElementById("fileLabel");

    if (this.files && this.files.length > 0) {
        // A file was selected, change the label style
        label.style.backgroundColor = "lightgray";
        // Change the label text to the first 6 characters of the file name
        label.textContent = this.files[0].name.substring(0, 8);
    } else {
        // No file was selected, reset the label style
        label.style.backgroundColor = "#cccccc23";
        label.textContent = "Add Img";
    }
});
