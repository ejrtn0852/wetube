import Video from "../models/Video";
import User from "../models/User";

export const trending = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ createdAt: "desc" });
        return res.render("home", { pageTitle: "home", videos });
    } catch {
        return res.status(400).render("server-error");
    }
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner");
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    console.log(video.owner, _id);
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    return res.render("edit", { pageTitle: video.title, video });
};

export const postEdit = async (req, res) => {
    const { title, description, hashtags } = req.body;
    const { id } = req.params;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/video/${id}`);
};

export const getVideo = (req, res) => {
    const video = new Video();
    const title = video.title;
    const description = video.description;
    return res.render("upload", { pageTitle: `Upload Video` });
};

export const postUpload = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { title, description, hashtags },
        file: { path: fileUrl },
    } = req;
    try {
        const newVideo = await Video.create({
            fileUrl,
            owner: _id,
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("upload", {
            pageTitle: `Upload Video`,
            errorMessage: error._message,
        });
    }
};

export const deleteVideo = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
    } = req;
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner");
    if (!video) {
        res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner._id) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    const { videos: videoList } = video.owner;
    if (videoList.length > 5) {
        //todo 남겨진 id목록으로 삭제된 동영상 기능 추가
        videoList.splice(5, 1);
        video.owner.save();
    }
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { search } = req.query;
    let videos = [];
    if (search) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(`^${search}|${search}$`, "i"),
            },
        });
    }
    return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};
