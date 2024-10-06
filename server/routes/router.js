const express = require('express')
const services = require('../services/services')
const Controller = require('../controller/controller')
const candidateController = require('../controller/candidateController')
const {jwtAuthMiddleware,generatetoken} = require('../jwtauth/jwt')
const passport = require('../autherization/auth')
const router = express.Router()


/*
* AutheMiddleware  |METHOD  ||Authentication BasicAuth
*/
const AutheMiddleware = passport.authenticate('local',{session:false})

router.get('/',(req,res)=>{
    res.send('voting app')
})


/*
* voter GET/POST  |METHOD  ||Routes
*/
// router.get('/user/signup',services.userSignup)



/*
* voter GET/POST  |METHOD  ||Controller
*/
 router.post('/user/signup',Controller.userSignup)
 router.get('/user/signup',jwtAuthMiddleware,Controller.usersAll)
 router.post('/user/login',Controller.userlogin)
 router.get('/user/profile',jwtAuthMiddleware,Controller.userProfile)
 router.put('/user/profile/password',jwtAuthMiddleware,Controller.userPasswordUpdate)

 
 /*
* vote/count GET/POST  |METHOD  ||Controller
*/
router.post('/vote/:candidateId',jwtAuthMiddleware,candidateController.vote);
router.get('/vote/count',candidateController.count);


module.exports = router