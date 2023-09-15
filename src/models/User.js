import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fileUrl: { type: String, required: true },
    socialOnly: { type: Boolean, default: false },
    avatarUrl: String,
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true, unique: true },
    location: String,
});

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
