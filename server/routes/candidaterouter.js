const express = require('express')
const services = require('../services/services')
const candidateController = require('../controller/candidateController')
const {jwtAuthMiddleware} = require('../jwtauth/jwt')
const passport = require('../autherization/auth')
const router = express.Router()


/*
* AutheMiddleware  |METHOD  ||Authentication BasicAuth
*/
const AutheMiddleware = passport.authenticate('local',{session:false})



/*
* voter GET/POST  |METHOD  ||Routes
*/
// router.get('/user/signup',services.userSignup)



/*
* voter GET/POST  |METHOD  ||Controller
*/
 router.post('/',jwtAuthMiddleware,candidateController.candidate)
 router.get('/',candidateController.lists)
 router.put('/:candidateId',jwtAuthMiddleware,candidateController.candidateUpdate)
 router.delete('/:candidateId',jwtAuthMiddleware,candidateController.candidateDelete)




module.exports = router