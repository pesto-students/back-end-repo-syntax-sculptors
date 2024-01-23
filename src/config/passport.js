const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../api/models/user.model');



passport.serializeUser((user, done)=>{
    done(null,user.id);
})

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    })
    
})

//Google Strategy
passport.use( new GoogleStrategy({
    //options for google strategy
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}), (accessToken, refreshToken,profile,done) =>{
    //passport callback function
    //accessToken is something that google will send to us
    //refreshToken is used to refresh accessToken as it expires
    //profile = profile info that callbackURI gives
    console.log("passport callback function fired");    
    console.log(profile)  //will give json object (id, displayName, name, photos,gender...)
    
    //check if user already exists in our database
    User.findOne({googleId: profile.id}).then((currentUser)=>{
       if(currentUser){
            console.log("user is" + currentUser);
            done(null, currentUser);
        }
            else{
            new User({
                username: profile.displayName,
                googleId: profile.id,
                thumbnail: profile._json.image.url
            }).save().then((newUser)=>{
                console.log('new user created' + newUser);
                done(null, newUser);
            });
        }

    });
    
    //create this new userfrom 'profile' in the database
    

});

//Local Strategy [to verify email and password]
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));