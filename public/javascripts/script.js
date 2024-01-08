// Add event listener to 'like' icon to submit form
function submitLikeForm(index) {
    // Pass through index of post so we 'like' the correct post
    document.getElementById(`likeForm${index}`).submit();
}
