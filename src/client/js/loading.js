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
    if (readyState === "loading" && readyState === "interactive") {
        loadBar.style.animation = `loadingBar 1s ease-in-out`;
    }
    if (readyState === "complete") {
        loadBar.style.display = "none";
    }
    console.log(readyState);
});
