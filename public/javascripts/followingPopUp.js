/// FOLLOWING POP-UP ///

document.getElementById("following").addEventListener("click", function () {
    document.getElementById("followingPopUp").style.display = "block";
});

// Close the modal if user clicks outside of it
window.addEventListener("click", function (event) {
    const followingPopUp = document.getElementById("followingPopUp");

    if (event.target === followingPopUp) {
        followingPopUp.style.display = "none";
    }
});
