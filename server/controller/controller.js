const User = require("../model/user");
const {jwtAuthMiddleware,generatetoken} = require('../jwtauth/jwt')



exports.userSignup = async (req, res) => {
    try {
        const data = req.body;
        // check the admin role
        const user = await User.find({role:{$eq:'Admin'}})
        if(user && (data.role === 'Admin')){
            return res.status(403).json({message:'there can not be multiple admin'})
        }
        

        // Ensure all required fields are provided
        if (!data.name || !data.age || !data.username || !data.address || !data.citizenShip || !data.password) {
            return res.status(400).json({ error: "All required fields must be provided." });
        }

        // Create a new user instance
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();

        //creating a payload
        const payload = {
            id: response.id
        }
        const token = generatetoken(payload);
        console.log('data saved');
        res.status(200).json({response,token:token});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.usersAll = async(req,res)=>{
    try {
        const data = await User.find();
        console.log('data fetched')
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({error:'server error'})
    }
}


exports.userlogin = async function(req,res){
    //logic of login
    const {citizenShip, password} = req.body
    const user = await User.findOne({citizenShip:citizenShip})
    if(!user||!(await user.comparePassword(password)))
    {
        return res.status(404).json({message:'Invalid user'})
    }
    const payload = {
        id : user.id
    }
    const token = generatetoken(payload)
    res.status(200).json({token:token})

}

exports.userProfile = async(req,res)=>{
    try{
        const userData = req.user
        const userId = userData.id;
        const response = await User.findById(userId);
        res.status(200).json(response)
    }
    catch(error){
        res.status(500).json({error:'server error'})
    }

}

exports.userPasswordUpdate = async(req,res)=>{
   try {
    const userData = req.user
    const userId = userData.id
    const {oldPassword,newPassword} = req.body

    const user = await User.findById(userId)
    if(!user||!(await user.comparePassword(oldPassword)))
        {
            return res.status(404).json({message:'Invalid user'})
        }

    user.password = newPassword
    await user.save();
    console.log('password changed')
    res.status(200).json({message:'password changed'})
   } catch (error) {
    res.status(500).json({error:'server error'})
   }
}


