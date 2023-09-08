import User from "../models/User";

export const getJoin = (req, res) => {

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
    await User.create({
        name,
        username,
        email,
        password,
        location
    });

    return res.redirect('/login');
}
export const edit = (req, res) => res.send('user!');
export const remove = (req, res) => res.send('delete!');
export const login = (req, res) => res.send('login!');
export const logout = (req, res) => res.send('logout!');
export const see = (req, res) => res.send('see');
