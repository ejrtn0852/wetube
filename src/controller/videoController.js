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
    const video = await Video.findById(id);
    const owner = await User.findById(video.owner);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    return res.render("watch", { pageTitle: video.title, video, owner });
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
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
    console.log(req.session);
    try {
        await Video.create({
            fileUrl,
            owner: _id,
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("upload", {
            pageTitle: `Upload Video`,
            errorMessage: error._message,
        });
    }
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
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
