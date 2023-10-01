import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Video from "../models/Video";
import multer from "multer";
import { Resolver } from "webpack";
import { application, json } from "express";
import { token } from "morgan";

export const getJoin = (req, res) => {
    console.log(req.body);
    return res.render("createAccount", { pageTitle: "createAccount" });
};

export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "createAccount";
    const Exists = await User.exists({ $or: [{ username }, { email }] });
    if (password !== password2) {
        return res.status(400).render("createAccount", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    if (Exists) {
        return res.status(400).render("createAccount", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
    } catch (error) {
        return res.status(400).render("createAccount", {
            pageTitle: `join`,
            errorMessage: error._message,
        });
    }

    return res.redirect("/login");
};

export const getLogin = (req, res) => {
    return res.render("login", { pageTitle: "login" });
};

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "login";
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "An account with this username dose not exits ",
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "wrong password",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseURL = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseURL}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseURL = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseURL}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        // DB애 저장된 Email과 깃헙에서 받은 이메일이 같은 것을 반환
        if (!user) {
            const user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

export const startKakaoLogin = (req, res) => {
    const baseURL = "https://kauth.kakao.com/oauth/authorize";
    const config = {
        response_type: "code",
        client_id: process.env.KaKo_ClIENT,
        redirect_uri: "http://localhost:4000/users/kakao/finish",
        scope: "account_email profile_nickname profile_image ",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseURL}?${params}`;
    return res.redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
    const baseURL = "https://kauth.kakao.com/oauth/token";
    const config = {
        client_id: process.env.KaKo_ClIENT,
        client_secret: process.env.KA_SECRET,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:4000/users/kakao/finish",
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseURL}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://kapi.kakao.com";
        const userData = await (
            await fetch(`${apiUrl}/v2/user/me`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
        ).json();
        const {
            properties: { nickname, profile_image },
            kakao_account: { email },
        } = userData;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                avatarUrl: profile_image,
                name: nickname,
                email: email,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        req.session.kakao = true;
        req.session.userID = userData.id;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("edit-profile");
};

export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id, avatarUrl, email: sessionEmail, name: sessionName },
        },
        body: { name, email, username, location },
        file,
    } = req;
    console.log(file);
    console.log(avatarUrl);

    try {
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {
                avatarUrl: file ? file.path : avatarUrl,
                location,
            },
            { new: true }
        );
        req.session.user = updateUser;
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(400).render("edit-profile", {
            errorMessage: "비정상 접근",
            avatarError: error,
        });
    }
};

export const getChangePassword = (req, res) => {
    console.log(req.session.user.socialOny);
    if (req.session.user.socialOny === true) {
        return res.redirect("/");
    }
    return res.render("users/change-password", {
        pageTitle: "change Password!",
    });
};

export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id, password },
        },
        body: { confirmation, newPassword, oldPassword },
    } = req;
    const ok = await bcrypt.compare(oldPassword, password);
    if (!ok) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect ",
        });
    }
    if (newPassword !== confirmation) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "new password does not match the Confirmation ",
        });
    }
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;
    return res.redirect("/");
};

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos");
    console.log(user);
    if (!user) {
        return res.status(400).render("404", { pageTitle: "User not found." });
    }
    return res.render("users/profile", {
        pageTitle: user.name,
        user,
    });
};

export const kakaoLogOut = async (req, res) => {
    const baseURL = "https://kauth.kakao.com";
    const logOutConfig = {
        client_id: process.env.KaKo_ClIENT,
        logout_redirect_uri: "http://localhost:4000/users/kakao/logout",
    };
    const logOutParams = new URLSearchParams(logOutConfig).toString();
    const finalUrl = `${baseURL}?${logOutParams}`;
    const logoutToken = await fetch(`${finalUrl}/v1/user/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    if ("access_token" in logoutToken) {
        console.log("access_token" + "있음");
    }
    if ("access_token" in logoutToken) {
        const { access_token } = logoutToken;
        const logout = await fetch(`${finalUrl}/v1/user/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${access_token}`,
            },
        });
        const data = await logout.json();
        console.log(data);
        return res.redirect("/");
    }
};
