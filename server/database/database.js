const mongoose = require('mongoose')
require('dotenv').config()
const LOCAL_MONGODB_URL = process.env.LOCAL_MONGODB_URL

mongoose.connect(LOCAL_MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;

db.on('connected',()=>{console.log('database connected to the server')})
db.on('disconnected',()=>{console.log('database failed to connect')})
db.on('error',(error)=>{console.log('error ' +error)});


module.exports = db;