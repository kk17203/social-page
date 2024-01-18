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
