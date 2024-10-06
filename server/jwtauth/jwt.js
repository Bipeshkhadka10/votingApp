const jwt = require('jsonwebtoken')
require('dotenv').config();
const jwtAuthMiddleware = (req,res,next)=>{

    //jwtauth logics
    //for token verify or authentication
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(404).json({message:'Invalid token'})
    
        try {
            const decoded = jwt.verify(token,process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({error:'Invalid token'})
        }
}


// function for token generations
const generatetoken =  (payload)=>{
    return jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'2 days'})
}

module.exports = {jwtAuthMiddleware,generatetoken};