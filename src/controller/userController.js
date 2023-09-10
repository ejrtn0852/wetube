import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    console.log(req.body);
    return res.render('createAccount', { pageTitle: "createAccount" });
}

export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location} = req.body;
    const pageTitle = "createAccount";
    const Exists = await User.exists({$or: [{username}, {email}] });
    if( password !== password2 ) {
        return res.status(400).render('createAccount',
        { pageTitle,
        errorMessage: "Password confirmation does not match.",
        });
    }
    if(Exists) {
        return res.status(400).render('createAccount',
        { pageTitle,
        errorMessage: "This username/email is already taken."
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location
        });
    }catch (error) {
        return res.status(400).render('createAccount', { 
        pageTitle: `join`,
        errorMessage: error._message});
    }

    return res.redirect('/login');
}

export const getLogin = (req, res) => {
    return res.render('login', { pageTitle:"login" } );
}

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "login";
    const user = await User.findOne({username});
    if( !user ) {
        return res.status(400).render("login", { 
        pageTitle,
        errorMessage: "An account with this username dose not exits " })
    }
    const ok = await bcrypt.compare(password, user.password);
    if( !ok ) {
        return res.status(400).render("login", { 
        pageTitle,
        errorMessage: "wrong password" })
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const edit = (req, res) => res.send('user!');
export const remove = (req, res) => res.send('delete!');
export const logout = (req, res) => res.send('logout!');
export const see = (req, res) => res.send('see');
