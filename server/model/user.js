const mongoose = require('mongoose');
const bcrypt =  require('bcrypt')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required:true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    citizenShip: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'Admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});




userSchema.pre('save', async function(next){
    // bcrypt and hasing password logic
    const pre_data = this;
    //check password is modified or not to hash it
    if(!pre_data.isModified('password')) return next();
    
   try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pre_data.password,salt);
    pre_data.password = hashedPassword;
    next();
   } catch (error) {
    return next(error)
   }
})

// compare function for password

userSchema.methods.comparePassword = async function(password){
    try {
        const isMatched = await bcrypt.compare(password,this.password)
        return isMatched
    } catch (error) {throw error }
}



const User = mongoose.model('User',userSchema);
module.exports = User;