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

// /// FOLLOWERS POP-UP ///

// document.getElementById("followers").addEventListener("click", function () {
//     document.getElementById("followersPopUp").style.display = "block";
// });

// // Close the modal if user clicks outside of it
// window.addEventListener("click", function (event) {
//     const followersPopUp = document.getElementById("followersPopUp");

//     if (event.target === followersPopUp) {
//         followersPopUp.style.display = "none";
//     }
// });

// /// FOLLOWING POP-UP ///

// document.getElementById("following").addEventListener("click", function () {
//     document.getElementById("followingPopUp").style.display = "block";
// });

// // Close the modal if user clicks outside of it
// window.addEventListener("click", function (event) {
//     const followingPopUp = document.getElementById("followingPopUp");

//     if (event.target === followingPopUp) {
//         followingPopUp.style.display = "none";
//     }
// });
