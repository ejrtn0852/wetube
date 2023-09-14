import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

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
    const user = await User.findOne({ username, socialOny: false });
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
                socialOny: true,
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

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("edit-profile");
};

export const postEdit = async (req, res) => {
    const { name, email, username, location } = req.body;
    const {
        session: {
            user: { _id },
        },
    } = req;

    if (req.session.user.email !== email) {
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {
                name,
                email,
                username,
                location,
            },
            { new: true }
        );
        req.session.user = updateUser;
        return res.redirect("/");
    } else {
        return res.status(400).render("edit-profile", {
            errorMessage: "This email is already taken",
        });
    }

    return res.redirect("edit");
};
export const remove = (req, res) => res.send("delete!");
export const see = (req, res) => res.send("see");
