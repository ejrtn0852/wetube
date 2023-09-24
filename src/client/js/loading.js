const loadBar = document.getElementById("load");

// const handleLoad = () => {
//     loadBar.style.display = "none";
// };

// const handleLoading = () => {
//     loadBar.style.animation = `loadingBar 1s ease-in-out`;
// };

// window.addEventListener("DOMContentLoaded", handleLoading);
// window.addEventListener("load", handleLoad);

document.addEventListener("readystatechange", () => {
    const { readyState } = document;
    console.log(readyState);
    if (readyState === "loading" || readyState === "interactive") {
        loadBar.classList.add("loading");
    }
    if (readyState === "complete") {
        loadBar.classList.remove("loading");
        loadBar.classList.add("hidden");
    }
});
