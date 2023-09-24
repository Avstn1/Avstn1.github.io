/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */


export function getImages() {
    const storedImages = localStorage.getItem('images');
    return storedImages ? JSON.parse(storedImages) : [];
}

export function getImageById(imageId) {
    const images = getImages();
    return images.find(image => image.imageId === imageId);
}


export function getLatestImage() {
    const images = getImages();
    if (images.length === 0) {
        const mockImage = {
            imageId: 'mock',
            title: 'Mock image',
            author: 'Mock Author',
            url: "webgallery/media/no_image.png",
        };
        return mockImage;
    }
    return images[0];
}

export function getComments(commentId) {
    const storedComments = localStorage.getItem('comments');
    return storedComments ? JSON.parse(storedComments) : [];
}

export function getCommentById(commentId) {
    const comments = getComments();
    return comments.find(comment => comment.commentId === commentId);
}

export function getCommentsByPage(pageNumber, imageId) {
    const comments = getComments()
        .filter(comment => comment.imageId === imageId)
        .sort((a, b) => b.date - a.date);

    const startIndex = (pageNumber - 1) * 10;
    const endIndex = startIndex + 10;

    return comments.slice(startIndex, endIndex);
}

export function getCommentsById(imageId) {
    const comments = getComments();
    return comments.filter(comment => comment.imageId === imageId);
}

// add an image to the gallery
export function addImage(title, author, url) {
    const date = Date.now().toString();
    const image = {
        imageId: date,
        title: title,
        author: author,
        url: url
    };
    const images = getImages();
    images.unshift(image);
    localStorage.setItem('images', JSON.stringify(images));
    return image.imageId;
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
    const images = getImages();
    const imageIndex = images.findIndex(image => image.imageId === imageId);
    deleteAllComments(imageId);
    if (imageIndex !== -1) {
        images.splice(imageIndex, 1);
        localStorage.setItem('images', JSON.stringify(images));
    }
    
}

export function deleteAllComments(imageId) {
    
    const comments = getComments();
    for(const comment in comments) {
        if(comment.imageId === imageId) {
            deleteComment(comment.commentId);
        }
    }
}


// add a comment to an image
export function addComment(commentId, author, content, imageId) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const comment = {
        commentId: commentId,
        date: formattedDate,
        author: author,
        content: content,
        imageId: imageId
    };

    const comments = getComments();
    comments.unshift(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
    return comment.commentId;
}

// delete a comment to an image
export function deleteComment(commentId) {
    const  comments = getComments();
    const commentIndex = comments.findIndex(comment => comment.commentId === commentId);
    if (commentIndex !== -1) {
        comments.splice(commentIndex, 1);
        localStorage.setItem('comments', JSON.stringify(comments));
    }
}
