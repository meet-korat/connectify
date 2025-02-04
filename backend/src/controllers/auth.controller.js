import { GenToken } from "../lib/utils.js";
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { v2 as cloudinary } from 'cloudinary';

export const signup= async (req , res)=>{
    
    const {fullname,password,email} = req.body;
    try{
        console.log(fullname,password,email);
        if(!fullname || !password || !email ) return res.status(400).json({message:"All fields are required"});
        if(password.length<8) return res.status(400).json({warning:"password must be atleast 8 characters long"});    
        
        const user=await User.findOne({email});
        if(user) return res.status(400).json({message:"email is already exist"});
        const salt=await bcrypt.genSalt(10);
        const hashPass=await bcrypt.hash(password,salt);
        const newUser= new User({
            fullname,
            email,
            password:hashPass,
        });
        

        if(newUser){
            GenToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                image:newUser.image,
            });

        }
        else res.status(400).json({message:"Invalid user data"});
        
    }
    catch(error){
        console.log("Internal server error in signup controller",error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
}; 


export const login= async (req , res)=>{
    try{
        const {email,password} = req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid email or password"});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid email or password"});
        const token = GenToken(user._id,res);

        console.log(user);

        res.status(201).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            image:user.image, 
            createdAt:user.createdAt, 
        });
    }
    catch(error){
        console.log("Internal server error in login controller",error);
        res.status(500).json({message:"Internal server error"});
    }

};
  
export const logout= (req , res)=>{

    try {
        res.cookie("jwt","",{
            maxAge:0,
            httpOnly:true,
            secure:process.env.NODE_ENV==="production"

        });
        res.status(200).json({
            success:true,
            message:"logout successful"
        });

    } catch (error) {
        console.log("Internal server error in logout controller",error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        });
        
    }
};

export const updateProfile= async (req , res)=>{

    try {
        const {image }=req.body;
        const userId=req.user._id;
        if(!image) return res.status(400).json({message:"image is required"});

        cloudinary.config({
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
            api_key:process.env.CLOUDINARY_API_KEY,
            api_secret:process.env.CLOUDINARY_API_SECRET,
        })

        const upload= await cloudinary.uploader.upload(image);
        
        const updateUserPic= await User.findByIdAndUpdate(userId,{image:upload.secure_url},{new:true});
        res.status(201).json({
            _id:updateUserPic._id,
            fullname:updateUserPic.fullname,
            email:updateUserPic.email,
            image:updateUserPic.image,
        });
    } catch (error) {
        console.log("Internal server error in updateProfile controller",error);
        res.status(500).json({message:"Internal server error"});
        
    }

}

export const CheckAuth= async (req , res)=>{
    try {
        console.log(req.user);
        res.status(201).json(req.user);
    } catch (error) {
        console.log("Internal server error in CheckAuth controller",error);
        res.status(500).json({message:"Internal server error"});
        
    }
}