import User from "../models/user.model.js";
import Message from "../models/message.model.js"

export const getuserSideBar = async(req,res) =>{
    try {
        const loggedInUserId=req.user._id;
        const filterUsers=await User.find({
            id:{$ne:loggedInUserId}
        }).select("-password");
        res.status(200).json(filterUsers)
    } catch (error) {
        console.log("Error in message controller of side bar user");
        res.status(500).json({message:"Error in inside server of message controllers"});
    }

}

export const getMessages =async (req,res)=>{
    try {
        const {id:userToChatId}=req.params.id;
        const myId=req.user._id;
        const messages = await Message.find({
        $or:[
            {senderId:myId ,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in message controller of get messages");
        res.status(401).json({message:"Error in message controller"});
        
    }
}

export const sendMessages =async(req,res)=>{
    try {
        const{image,text}=req.body;
        const{id:receiverId}=req.params.id;
        const senderId=req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage=new Messages({
            senderId,
            receiverId,
            image:imageUrl,
            text
        })
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in send messages");
        res.status(401).json({message:"Error in message controller"})
    }
}