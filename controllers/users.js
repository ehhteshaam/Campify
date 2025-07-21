const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Campify!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        if (e.code === 11000) {
            if (e.keyPattern.email) {
                req.flash('error', 'Email is already registered.');
            } else if (e.keyPattern.username) {
                req.flash('error', 'Username is already taken.');
            } else {
                req.flash('error', 'User already exists.');
            }
        } else {
            req.flash('error', e.message);
        }
        res.redirect('/register');
    }
}

module.exports.renderLogin =  (req, res) => {
    res.render('users/login');
}


module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout =  (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}