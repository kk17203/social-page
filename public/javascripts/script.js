// Add event listener to 'like' icon to submit form
function submitLikeForm(index) {
    // Pass through index of post so we 'like' the correct post
    document.getElementById(`likeForm${index}`).submit();
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
