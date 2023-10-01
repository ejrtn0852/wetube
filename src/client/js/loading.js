const loadBar = document.getElementById("load");

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
