import { getImages, getCommentById, getComments, getImageById, addComment, addImage, deleteComment, deleteImage, getLatestImage, getCommentsByPage, getCommentsById } from "./api.mjs";


//Globals
let page = 1;

function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

function areRequiredFieldsFilled() {
    const form = document.querySelector("form"); // Select the form element
    const requiredFields = form.querySelectorAll('[required]');
    for (const field of requiredFields) {
      if (!field.value) {
        return false;
      }
    }
    return true;
  }

function navigateLeft() {
    const currentImage = getImageById(imageDisplay.id);
    const images = getImages();
    const index = images.findIndex(image => image.imageId === currentImage.imageId);
    if(index > 0) {
        const previousImage = images[index - 1];
        imageDisplay.id = previousImage.imageId;
        imageDisplay.querySelector("img").src = previousImage.url;
        imageDisplay.querySelector(".image_display_title").textContent = previousImage.title;
        imageDisplay.querySelector(".image_display_author").textContent = previousImage.author;

    }
}

function navigateRight() {
    const currentImage = getImageById(imageDisplay.id);
    const images = getImages();
    const index = images.findIndex(image => image.imageId === currentImage.imageId);
    if(index < images.length - 1) {
        const nextImage = images[index + 1];
        imageDisplay.id = nextImage.imageId;
        imageDisplay.querySelector("img").src = nextImage.url;
        imageDisplay.querySelector(".image_display_title").textContent = nextImage.title;
        imageDisplay.querySelector(".image_display_author").textContent = nextImage.author;
    }
}

function checkImageEdge() {
    const currentImage = getImageById(imageDisplay.id);
    const images = getImages();
    const index = images.findIndex(image => image.imageId === currentImage.imageId);
    if(index === 0 && images.length > 1) {
        leftArrow.style.opacity = "0.5";
        rightArrow.style.opacity = "1";
        leftArrow.style.cursor = "default";
        rightArrow.style.cursor = "pointer";
    } else if (index === images.length - 1 && images.length > 1) {
        rightArrow.style.opacity = "0.5";
        leftArrow.style.opacity = "1";
        rightArrow.style.cursor = "default";
        leftArrow.style.cursor = "pointer";
    } else if (0 < index < images.length - 1) {
        leftArrow.style.opacity = "1";
        rightArrow.style.opacity = "1";
        leftArrow.style.cursor = "pointer";
        rightArrow.style.cursor = "pointer";
    } else if(images.length <= 1) {
        leftArrow.style.opacity = "0.5";
        rightArrow.style.opacity = "0.5";
        leftArrow.style.cursor = "default";
        rightArrow.style.cursor = "default";
    }
}

// Global defined for the displayComments function
const newSection = document.createElement("div");
function displayComments(pageNumber) {
    // Create comments section and display 10 latest comments

    newSection.id = "fresh_comments";
    newSection.innerHTML = "";

    const commentsSection = document.getElementById("comment_section");
    const comments = getCommentsByPage(pageNumber, imageDisplay.id);
    for (const comment of comments) {
        if(comment.imageId === imageDisplay.id) {
            const commentElement = document.createElement("div");
            commentElement.className = "comment";
            commentElement.id = "comment";
            commentElement.innerHTML = `
                <div class="comment_user_date" data-id="${comment.commentId}">
                    <div class="comment_user">${comment.author}</div>
                    <div class="comment_date">${comment.date}</div>
                </div>
                <div class="comment_text">${comment.content}</div>
                <button class="comment_delete" type="button" id="comment_delete">Delete</button>
            `;
            newSection.append(commentElement);
        }
    }
    if(newSection.innerHTML === "") {
        newSection.innerHTML = `
            <div class="no_comments">No comments yet.</div>
        `;
    }

    commentsSection.append(newSection);
}

//////////////////////////////////////////////////////////////////////////////////////////////
// Create the image display element
// Default image display after refreshing the page

const imageDisplay = document.createElement("div");
const imageTitle = getLatestImage().title;
const imageAuthor = getLatestImage().author;
const imageUrl = getLatestImage().url;
imageDisplay.id = getLatestImage().imageId;
imageDisplay.className = "image_container";


imageDisplay.innerHTML = `
    
    <img class="image_display" src="${imageUrl}" alt="${imageTitle}"/>
    <div class="image_display_information">
        <div class="image_display_title">${imageTitle}</div>
        <div class="image_display_author">by ${imageAuthor}</div>
        <button class="image_delete" type="button">Delete</button>
    </div>

`;

document.getElementById("display_image").append(imageDisplay);


/////////////////////////////////////////////////////////////
// Sidebar and add image form

const toggleButton = document.getElementById("image_toggle");
const sidebar = document.getElementById("sidebar");
const closeSidebarButton = document.getElementById("close_sidebar");
const cancelButton = document.getElementById("cancel_sidebar");

toggleButton.addEventListener("click", function () {
    sidebar.style.right = "0";
});

closeSidebarButton.addEventListener("click", function () {
    if (areRequiredFieldsFilled()) {
        // Add the image to the gallery
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const url = document.getElementById("url").value;
        const imageId = addImage(title, author, url);
        const latestImage = getLatestImage();

        // Add the image to the display
        imageDisplay.id = latestImage.imageId;
        imageDisplay.querySelector("img").src = latestImage.url;
        imageDisplay.querySelector(".image_display_title").textContent = latestImage.title;
        imageDisplay.querySelector(".image_display_author").textContent = latestImage.author;

        sidebar.style.right = "-320px";
    } else {
        // Display an error message or highlight required fields
        alert("Please fill in all required fields.");
    }
});

cancelButton.addEventListener("click", function () {
    sidebar.style.right = "-320px";
});


// Right and left arrows navigation

const rightArrow = document.getElementById("right_arrow");
const leftArrow = document.getElementById("left_arrow");

rightArrow.addEventListener("click", function () {
    navigateRight();
    checkImageEdge();
    page = 1;
    displayComments(page);
});

leftArrow.addEventListener("click", function () {
    navigateLeft();
    checkImageEdge();
    page = 1;
    displayComments(page);
});


document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        navigateLeft();
        checkImageEdge();
        page = 1;
        displayComments(page);
    }
    if (event.key === "ArrowRight") {
        navigateRight();
        checkImageEdge();
        page = 1;
        displayComments(page);
    }
});


// Deleting images

const deleteButton = document.querySelector(".image_delete");

deleteButton.addEventListener("click", function () {
    const imageId = imageDisplay.id;
    deleteImage(imageId);
    const latestImage = getLatestImage();
    imageDisplay.id = latestImage.imageId;
    imageDisplay.querySelector("img").src = latestImage.url;
    imageDisplay.querySelector(".image_display_title").textContent = latestImage.title;
    imageDisplay.querySelector(".image_display_author").textContent = latestImage.author;
    displayComments(page);
});



//////////////////////////////////////////////////////////////////////////////////////////////
// Default function calls

document.addEventListener("DOMContentLoaded", function () {
    displayComments(page);
    checkImageEdge();
});


//////////////////////////////////////////////////////////////////////////////////////////////
// Submitting comments
const commentSubmitButton = document.getElementById("comment_submit");

commentSubmitButton.id = "comment_submit";
commentSubmitButton.addEventListener("click", function () {
    event.preventDefault();
    const commentId = Date.now().toString();
    const commentUser = document.getElementById("comment_name").value;
    const commentText = document.getElementById("comment_input").value;
    const placeholderExists = getImages();
    if(commentUser !== "" && commentText !== "" && placeholderExists.length > 0) {
        addComment(commentId, commentUser, commentText, imageDisplay.id);
        // Clear the form
        document.getElementById("comment_name").value = "";
        document.getElementById("comment_input").value = "";
        const freshComments = document.getElementById("fresh_comments");
        freshComments.innerHTML = "";
        page = 1;
        displayComments(page);
        scrollToBottom();
    }
});

// Canceling comments

const commentCancelButton = document.getElementById("comment_cancel");
commentCancelButton.addEventListener("click", function () {
    document.getElementById("comment_name").value = "";
    document.getElementById("comment_input").value = "";
});


// Deleting comments

const commentsContainer = document.getElementById("comment_section");
commentsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("comment_delete")) {
        const commentElement = event.target.closest(".comment");
        if (commentElement) {
            const commentId = commentElement.querySelector(".comment_user_date").getAttribute("data-id");
            // Delete the comment by its ID
            deleteComment(commentId);
            commentElement.remove();
        }
        displayComments(page);
        scrollToBottom();
    }
    if(getCommentsByPage(page, imageDisplay.id).length === 0) {
        page = page - 1;
        displayComments(page);
        scrollToBottom();
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////
// Pagination for comments

const commentNext = document.getElementById("comment_next");
const commentBack = document.getElementById("comment_back");

commentNext.addEventListener("click", function () {

    // TODO: replace 1 with condition that if there are 10 comments on the page, check if there are more comments on the next
    if (getCommentsByPage(page, imageDisplay.id).length === 10 && getCommentsByPage(page+1, imageDisplay.id).length > 0) {
        console.log(getCommentsByPage(page+1, imageDisplay.id).length);
        console.log(getComments().length);
        page = page + 1;
        displayComments(page);
        scrollToBottom();
    }
});

commentBack.addEventListener("click", function () {
    if(page > 1) {
        page = page - 1;
        displayComments(page);
        scrollToBottom();
    }
});
