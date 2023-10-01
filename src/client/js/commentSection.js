const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.getElementById("deleteBtn");
const commentContainer = document.querySelector(".video__comment");
const commentBox = document.querySelector("textarea");

const addComment = (text, id, username) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const idDeleteDiv = document.createElement("div");
    idDeleteDiv.className = "id-Delete_box";
    const span0 = document.createElement("span");
    span0.innerText = `${username}`;
    const span1 = document.createElement("span");
    span1.innerText = "❌";
    idDeleteDiv.appendChild(span0);
    idDeleteDiv.appendChild(span1);
    const div = document.createElement("div");
    div.className = "comment-text";
    const span2 = document.createElement("span");
    span2.innerText = ` ${text}`;
    div.appendChild(span2);
    newComment.appendChild(idDeleteDiv);
    newComment.appendChild(div);
    videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;

    if (text.trim() === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId, username } = await response.json();
        addComment(text, newCommentId, username);
        window.location.assign(`/video/${videoId}`);
    }
};

const handleDelete = async () => {
    const { id: commentId } = commentContainer.dataset;
    const { id: videoId } = videoContainer.dataset;
    console.log(videoId);
    const response = await fetch(
        `/api/videos/${videoId}/comment/${commentId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    if (response.status === 302) {
        commentContainer.remove();
        deleteBtn.remove();
        location.reload();
    }
};

const commentError = async () => {
    const result = await fetch("/api/comments/error", {
        method: "POST",
    });
    console.log(result);
    if (!result.ok) {
        window.location.assign("/login");
    }
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}
if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDelete);
}
commentBox.addEventListener("click", commentError);
