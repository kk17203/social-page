function submitLikeForm(event, index) {
    const likeIcon = document.getElementById(`likeIcon${index}`);
    const likeForm = document.getElementById(`likeForm${index}`);

    const postId = likeForm.elements.postId.value;

    // Toggles class list
    const style = likeIcon.classList.contains("fa-regular")
        ? "fa-solid"
        : "fa-regular";
    likeIcon.classList.replace(likeIcon.classList.item(0), style); // Finds the first class and replaces it with style

    // Prevent the form from being submitted normally
    event.preventDefault();

    // Send a POST request to the /likes route
    fetch("/dashboard/likes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            postId: postId,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        })
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
}

function openCommentsForm(index) {
    // Find commentsForm div using passed index
    const commentsForm = document.getElementById(
        `commentsFormContainer${index}`
    );
    const currentDisplay = commentsForm.style.display;
    // Toggle commentsForm display
    commentsForm.style.display = currentDisplay === "none" ? "block" : "none";

    // Find outlined comment icon using passed index
    const iconReg = document.getElementById(`iconReg${index}`);
    const iconRegDisplay = iconReg.style.display;
    // Toggle outlined comment icon display
    iconReg.style.display = iconRegDisplay === "none" ? "block" : "none";

    // Find solid comment icon using passed index
    const iconSolid = document.getElementById(`iconSolid${index}`);
    let iconSolidDisplay = iconSolid.style.display;
    // Toggle solid comment icon display
    iconSolid.style.display = iconSolidDisplay === "none" ? "block" : "none";

    // If comments form is open (remember this is after we JUST opened it in above code)
    if (commentsForm.style.display === "block") {
        // Find text area and focus on it
        const textarea = document.getElementById(`commentContent${index}`);
        if (textarea) {
            textarea.focus();
        }
        // Add window event listener to hide comments form when clicked outside
        window.addEventListener("click", function (event) {
            //Check to make sure click isn't inside the commentsForm or the regular icon
            const isClickInsideForm =
                commentsForm.contains(event.target) ||
                event.target === commentsForm;
            const isClickOnIconReg = event.target === iconReg;

            // If click is anywhere but these 2 places...
            if (!isClickInsideForm && !isClickOnIconReg) {
                // Close comments form
                commentsForm.style.display = "none";
                // Hide solid comment icon
                iconSolid.style.display = "none";
                // Show outlined comment icon
                iconReg.style.display = "block";
            }
        });
    }
}
