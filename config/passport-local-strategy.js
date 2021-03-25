// npm install passport
const passport = require('passport');

//npm install passport-local
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authenticate using passport

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback:true
}, function (req,email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {
        if (err) { req.flash('error',err);return done(err); }

        if (!user || user.password != password) {
            req.flash('error','Invalid Username/Password');
            return done(null, false);
        }
        return done(null, user);
    });
}));

//serializing the user to decide which key is kept in cookies
passport.serializeUser(function (user, done) {
    done(null, user.id);
});



//deserializing the user from key in the cookies
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) { console.log("Error in finding the user-->Passport"); return done(err); }
        return done(null, user);
    });
});


//setting up current authenticated user for views
passport.checkAuthentication=function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated){
        //req.user contain the current signin user data and pass this to locals for views
        res.locals.user=req.user;
    }
    next();
}
module.exports = passport;