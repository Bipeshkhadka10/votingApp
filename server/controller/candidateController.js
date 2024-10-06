const User = require("../model/user");
const Candidate = require('../model/candidate')


//function for the adminrole check

const checkAdminrole = async function (userId){
    try {
        const user = await User.findById(userId);
        return user.role === 'Admin';
    } catch (error) {
        return error;
    }
}


exports.candidate = async (req, res) => {
    if(! await checkAdminrole(req.user.id)){
        return res.status(403).json({message:'user is not allowed '})
     }
     try {
        const data = req.body;

        // Create a new user instance
        const newCandidate = new Candidate(data);

        // Save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};



exports.candidateUpdate = async(req,res)=>{
   try {
    if(! await checkAdminrole(req.user.id)){
        return res.status(403).json({message:'user is not allowed '})
     }
    const candidateid = req.params.candidateId;
    const data = req.body;

    const response = await Candidate.findByIdAndUpdate(candidateid,data,{
        runValidators:true,
        new:true
    })
    if(!response){
        res.status(404).json({message:'candidate not found'})
    }
    console.log('candidate updated')
    return res.status(200).json({message:'candidate updated'})
   } catch (error) {
    return res.status(500).json({error:'server error'})
   }
}

exports.candidateDelete = async(req,res)=>{
    try {
        if(! await checkAdminrole(req.user.id)){
            return res.status(403).json({message:'user is not allowed '})
         }
     const candidateid = req.params.candidateId;
     const response = await Candidate.findByIdAndDelete(candidateid);
     if(!response){
        return res.status(404).json({message:'candidate not found'})
     }
     console.log('candidate deleted')
     return res.status(200).json({message:'candidate deleted'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'server error'})
    }
 }
 

 // vote and votecount of candidates and user logics
 
exports.vote = async(req,res)=>{
    try {
        const candidateid = req.params.candidateId
        const userID = req.user.id
        // check for candidate
        const candidate = await Candidate.findById(candidateid);
        if(!candidate )
        {
            return res.status(404).json({message:'candidate not found'})
        }
        //check for user
        const user = await User.findById(userID);
        if(! user)
        {
            return res.status(404).json({message:'user not found'})
        }
        
        if(user.role ==='Admin')
        {
            return res.status(403).json({message:'admin cannot vote'})
        }

        if(user.age < 18)
        {
           return res.status(403).json({message:'user is underage'})
        }

        if(user.isVoted)
        {
            return res.status(403).json({message:'user is already voted'})
        }

        //change user vote status
        user.isVoted = true;
        await user.save();

        //change candidate status
        candidate.votes.push({user: user.id});
        candidate.voteCount++;
        await candidate.save(); 
        
        console.log('votted successfully')
        return res.status(200).json({message:'votted successfully'})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'server error'})
    }
}


//count 

exports.count = async(req,res)=>{
    try {
        const candidate = await Candidate.find().sort({voteCount:-1});

        const voteRecord = candidate.map((data)=>{
            return {
                Name : data.name,
                TotalVote : data.voteCount
            }
        })
        console.log('result fetched')
        return res.status(200).json(voteRecord)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'server error'})
    }
}
