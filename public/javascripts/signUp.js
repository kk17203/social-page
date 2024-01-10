function selectProfilePicture(labelId, imageId) {
    const element = document.getElementById(labelId);
    element.selected = true;
    console.log(element);
    const image = document.getElementById(imageId);
    image.classList.add("selected-profile-pic-signup");
    window.addEventListener("click", function (event) {
        if (event.target !== element && event.target !== image) {
            element.selected = false;
            image.classList.remove("selected-profile-pic-signup");
        }
    });
}
