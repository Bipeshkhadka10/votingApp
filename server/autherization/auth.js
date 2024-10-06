const passport = require('passport')
const User = require('../model/user')
const LocalStratergy = require('passport-local').Strategy

passport.use( new LocalStratergy({
    usernameField:'citizenShip',    // loacalstratergy usually used for username so we must specify for using citizenShip
    passwordField:'password'        // its optional for passwordField to be specified
    },async function(citizenShip, password, done){
   try {
     // logic for the authentication 
     console.log('Recived Credientials:',citizenShip,password)

     const  user = await User.findOne({citizenShip:citizenShip})
     if(!user) return done(null,false,{message:'Invalid user'})
     const isPassword = await user.comparePassword(password); 
    if(isPassword)
     {
         return done(null, user)
     }else{
         return done(null,false,{message:'Invalid password'})
     }
   } catch (error) {
    return done(error)
   }
}))

module.exports = passport