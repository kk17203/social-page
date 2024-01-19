function submitLikeForm(event, index) {
    const likeIcon = document.getElementById(`likeIcon${index}`);
    const likeForm = document.getElementById(`likeForm${index}`);

    // Define formData from the likeForm's body
    const formData = new FormData(likeForm);

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
        body: formData,
    })
        .then((response) => {
            // If response is not ok throw error
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // If response is ok parse data as JSON
            return response.json();
        })
        // Data should contain likes key passed from /dashboard/likes response
        .then((data) => {
            // Update the likes count in the DOM
            const likesCount = document.getElementById(`likesCount${index}`);
            if (likesCount) {
                // If it found an element id matching likesCount(index)
                likesCount.textContent = `${data.likes} likes -`;
            }
        })
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
}

// Follow submit
function submitFollow(
    event,
    index,
    userId,
    userName,
    userUsername,
    userProfilePic
) {
    event.preventDefault();

    const followButton = document.getElementById(`followButton${index}`);
    const followForm = document.getElementById(`followForm${index}`);
    const formData = new FormData(followForm);
    const followerCount = document.getElementById("followerCount");
    const allUsersPopup = document.getElementById("allUsersPopup");

    const style = followButton.classList.contains("follow-button")
        ? "unfollow-button"
        : "follow-button";
    followButton.classList.replace(followButton.classList.item(0), style);

    // Toggle button text. If style is 'follow-button' then text content is 'Follow'
    followButton.textContent =
        style === "follow-button" ? "Follow" : "Unfollow";

    if (followerCount) {
        followerCount.textContent =
            style === "follow-button"
                ? parseInt(followerCount.textContent, 10) - 1
                : parseInt(followerCount.textContent, 10) + 1;
    }

    // Get the user container for the current user
    const userContainer = document.getElementById(`userContainer${userId}`);

    if (style === "follow-button") {
        // If the user is currently following, remove the user container
        if (userContainer) {
            userContainer.remove();
        }
    } else {
        // If the user is not currently following, add a new user container
        const newUserContainer = document.createElement("div");
        newUserContainer.classList.add("user-container");
        newUserContainer.id = `userContainer${userId}`;

        // Add user details to the new user container
        newUserContainer.innerHTML = `
            <div class="user-link">
                <a href="/userPage/${userId}">
                    <img src="${userProfilePic}" alt="Profile Pic" class="profile-pic" />
                </a>
            </div>
            <div class="user-info-form-container">
                <div class="user-list-info-and-form">
                    <div class="users-list-info">
                        <p class="users-list-name">${userName}</p>
                        <p class="users-list-username">${userUsername}</p>
                    </div>
                </div>
            </div>
        `;

        // Add the new user container to the modal
        if (allUsersPopup) {
            allUsersPopup.appendChild(newUserContainer);
        }
    }

    fetch("/users/", {
        method: "POST",
        body: formData,
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
