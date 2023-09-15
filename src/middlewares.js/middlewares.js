import multer from "multer";
export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.sitName = "wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
};

export const timeMiddleware = (req, res, next) => {
    const date = new Date();
    const hours = date.getHours();
    const min = date.getMinutes();
    const seconds = date.getSeconds();
    console.log(`${hours}시 ${min}분 ${seconds}초`);
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/");
    }
};

export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
        fileSize: 999999999999999,
    },
});

export const videoUpload = multer({
    dest: "uploads/video/",
    limits: { fileSize: 999999999999999 },
});
