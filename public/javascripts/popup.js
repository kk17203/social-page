/// JS for Select Profile Pic form ///

document.getElementById("openModalBtn").addEventListener("click", function () {
    document.getElementById("myModal").style.display = "block";
});

// Close the modal if user clicks outside of it
window.addEventListener("click", function (event) {
    const myModal = document.getElementById("myModal");

    if (event.target === myModal) {
        myModal.style.display = "none";
    }
});

function selectProfilePicture(labelId, imageId) {
    const element = document.getElementById(labelId);
    element.selected = true;
    const image = document.getElementById(imageId);
    image.classList.add("selected-profile-pic");
    window.addEventListener("click", function (event) {
        if (event.target !== element && event.target !== image) {
            element.selected = false;
            image.classList.remove("selected-profile-pic");
        }
    });
}

/// END JS for Select Profile Pic form ///

// // User page submit form
// function submitUserPageForm() {
//     document.getElementById("userPageForm").submit();
// }
