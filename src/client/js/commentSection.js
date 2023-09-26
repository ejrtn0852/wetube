const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.getElementById("deleteBtn");

const addComment = (text) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span");
    span2.innerText = "❌";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const { status } = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    textarea.value = "";
    if (status === 201) {
        console.log(" created fake comment");
    }
    addComment(text);
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}

if (deleteBtn) {
    const handleDelete = async () => {
        dd;
    };

    deleteBtn.addEventListener("click", handleDelete);
}
