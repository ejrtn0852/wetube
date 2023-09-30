import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");
const loadBar = document.getElementById("load");

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};

const handleDownload = async () => {
    actionBtn.removeEventListener("click", handleDownload);

    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true;

    const { input, output, thumb } = files;
    const ffmpeg = createFFmpeg({
        log: true,
    });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", input, await fetchFile(videoFile));

    await ffmpeg.run("-i", input, "-r", "60", output);
    await ffmpeg.run("-i", input, "-ss", "00:00:01", "-frames:v", "1", thumb);

    const mp4File = ffmpeg.FS("readFile", output);
    const thumbFile = ffmpeg.FS("readFile", thumb);

    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "img/jpeg" });

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.webm");
    downloadFile(thumbUrl, "MyThumbnail.jpg");

    ffmpeg.FS("unlink", input);
    ffmpeg.FS("unlink", output);
    ffmpeg.FS("unlink", thumb);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);

    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again";
    actionBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
    actionBtn.innerText = "Recording";
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
        actionBtn.innerText = "Download";
        actionBtn.disabled = false;
        actionBtn.addEventListener("click", handleDownload);
    };
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 5000);
};

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });
    video.srcObject = stream;
    loadBar.classList.add("loading");
    video.play();
    loadBar.classList.remove("loading");
    loadBar.classList.add("hidden");
};
init();

document.addEventListener("DOMContentLoaded", init);
actionBtn.addEventListener("click", handleStart);
