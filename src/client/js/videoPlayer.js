const video = document.getElementById("watchVideo");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const $fullScreen = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const playI = document.querySelector("#play i");
let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;

const handlePlayClick = () => {
    if (video.paused) {
        playI.classList.remove("fa-solid", "fa-play", "fa-lg");
        video.play();
        playI.classList.add("fa-solid", "fa-pause");
    } else {
        video.pause();
        playI.classList.add("fa-solid", "fa-play", "fa-lg");
    }
};

const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
        volumeRange.value = 0;
    } else {
        video.muted = true;
        volumeRange.value = volumeValue;
    }
};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    value < 0 ? (video.muted = true) : (video.muted = false);
    volumeValue = value;
    video.volume = volumeValue;
};

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = video.duration;
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const { value } = event.target;
    video.currentTime = value;
};

const handleFullScreen = () => {
    const fullScreen = document.fullscreenElement;
    if (fullScreen) {
        document.exitFullscreen();
    } else {
        videoContainer.requestFullscreen();
    }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 2000);
};

const handleEnded = () => {
    // 프론트랑 백 api 통신
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method: "POST",
    });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
$fullScreen.addEventListener("click", handleFullScreen);
