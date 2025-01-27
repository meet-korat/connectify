import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req,res,next) =>{
    try{
        
        const token=req.cookies.jwt;
       
        if(!token) return res.status(401).json({message:"Unauthorized by token"});

        const verifyUser=jwt.verify(token,process.env.JWT_SECRET);

        if(!verifyUser) return res.status(401).json({message:"Unauthorized by user"});
        
        
        const user=await User.findById(verifyUser.userId).select("-password");

        if(!user) return res.status(401).json({message:"User not found"});
        req.user=user;

        next(); 

    }
    catch(error){
        console.log("Internal server error in auth middleware",error);
        res.status(500).json({message:"Internal server error"});
    }
}