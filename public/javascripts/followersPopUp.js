/// FOLLOWERS POP-UP ///

document.getElementById("followers").addEventListener("click", function () {
    document.getElementById("followersPopUp").style.display = "block";
});

// Close the modal if user clicks outside of it
window.addEventListener("click", function (event) {
    const followersPopUp = document.getElementById("followersPopUp");

    if (event.target === followersPopUp) {
        followersPopUp.style.display = "none";
    }
});
