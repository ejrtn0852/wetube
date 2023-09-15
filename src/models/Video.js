import mongoose, { Schema } from "mongoose";

const videoSchema = new mongoose.Schema({
    fileUrl: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxLength: 10 },
    description: { type: String, required: true, trim: true, maxLength: 80 },
    createdAt: { type: Date, default: Date.now },
    hashtags: [{ type: String }],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
});

videoSchema.static("formatHashtags", function (hashtags) {
    return hashtags
        .split(",")
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
