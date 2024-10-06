const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const router = require('./server/routes/router')
const candidateRouter = require('./server/routes/candidaterouter')
const db = require('./server/database/database');
const passport = require('./server/autherization/auth');
require('dotenv').config();

app.use(bodyparser.json())
app.use(passport.initialize());

//routes
app.use('/',router)
app.use('/candidate',candidateRouter)
app.listen(process.env.PORT,()=>{
    console.log('successfully render at port:'+ process.env.PORT)
})