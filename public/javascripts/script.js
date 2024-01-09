// Add event listener to 'like' icon to submit form
function submitLikeForm(index) {
    // Pass through index of post so we 'like' the correct post
    document.getElementById(`likeForm${index}`).submit();
}

function openCommentsForm(index) {
    const commentsForm = document.getElementById(`comments-form${index}`);
    commentsForm.style.display =
        commentsForm.style.display === "none" ? "block" : "none";
}

// PROBLEM IS HERE
