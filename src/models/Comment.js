import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    text: { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    createdAt: { type: Date, default: Date.now },
    videos: [
        { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
    ],
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
