export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.sitName = "wetube";
    res.locals.loggedInUser = req.session.user;
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
