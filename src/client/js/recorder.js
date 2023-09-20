const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;

const handleStop = () => {
    startBtn.innerText = "Start Recording";
    startBtn.addEventListener("click", handleStart);
    startBtn.removeEventListener("click", handleStop);
    recorder.stop();
};

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        const videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 10000);
};

const init = (async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });
    video.srcObject = stream;
    video.play();
})();

startBtn.addEventListener("click", handleStart);
