const handleLoad = () => {
    console.log("hi!");
};

if (document.readyState === "loading") {
    window.addEventListener("load", handleLoad);
}
