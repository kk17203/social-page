document.getElementById("openModalBtn").addEventListener("click", function () {
    document.getElementById("myModal").style.display = "block";
});

// Close the modal if user clicks outside of it
window.addEventListener("click", function (event) {
    if (event.target === this.document.getElementById("myModal")) {
        this.document.getElementById("myModal").style.display = "none";
    }
});

function selectProfilePicture(imageId) {
    console.log(imageId);
    document.getElementById(imageId).checked = true;
}
