import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import { getReceiverSocketId,io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js"; 
import formidable from "formidable";

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
        const {id:userToChatId}=req.params;
        console.log("first",userToChatId)    
        const myId=req.user._id;
        const messages = await Message.find({
        $or:[
            {senderId:myId ,recieverId:userToChatId},
            {senderId:userToChatId,recieverId:myId}
        ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in message controller of get messages");
        res.status(401).json({message:"Error in message controller"});
        
    }
}

// export const sendMessages =async(req,res)=>{
//     try {
//         const{text,image}=req.body;
//         const{id: recieverId}=req.params;
//         const senderId=req.user._id;
//         console.log("first",text,image)
//         if (!senderId || !recieverId) {
//             return res.status(401).json({ message: "User not authenticated" });
//         }

//         let imageUrl=null;
//         if(image){
//             const uploadResponse=await cloudinary.uploader.upload(image);
//             imageUrl=uploadResponse.secure_url;
//         }

//         const newMessage=new Message({
//             senderId,
//             recieverId,
//             text,
//             image:imageUrl,
            
//         })
//         console.log(1)
//         await newMessage.save();
//         console.log(2)
//         const receiverSocketId =getReceiverSocketId(recieverId);
//         if(receiverSocketId){
//             io.to(receiverSocketId).emit("newMessage",newMessage);
//         }
//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.log("Error in send messages");
//         res.status(401).json({message:"Error in message controller"})
//     }
// }



export const sendMessages = (req, res) => {
    // Create a new instance of Formidable with the updated API
    const form = formidable({
      uploadDir: './uploads', // Temporary upload directory
      keepExtensions: true,   // Preserve file extensions
      multiples: true,        // Allow multiple files to be uploaded if needed
    });
  
    // Parse incoming form data
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("Error parsing form data:", err);
        return res.status(405).json({ message: "Error parsing form data" });
      }
  
      console.log("Fields received:", fields); // Log all fields for debugging
  
      // Ensure correct extraction of text and receiverId
      const text = Array.isArray(fields.text) ? fields.text[0] : fields.text;
      const recieverId = Array.isArray(fields.recieverId) ? fields.recieverId[0] : fields.recieverId;
      const senderId = req.user._id;
      if (!text || !recieverId) {
        return res.status(406).json({ message: "Text and receiverId are required" });
      }
  
      // Image upload logic
      let imageUrl = null;
      if (files.image) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(files.image[0].path); // Assuming files.image is an array
          imageUrl = uploadResponse.secure_url;
        } catch (uploadError) {
          console.log('Error uploading image:', uploadError);
          return res.status(500).json({ message: "Error uploading image" });
        }
      }
  
      // Create new message object
      const newMessage = new Message({
        senderId,
        recieverId,
        text,
        image: imageUrl,
      });
  
      try {
        await newMessage.save(); // Save message to DB
        console.log("Message saved:", newMessage);
  
        // Notify receiver via socket if connected
        const receiverSocketId = getReceiverSocketId(recieverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
  
        return res.status(201).json(newMessage);
      } catch (saveError) {
        console.error('Error saving message:', saveError);
        return res.status(500).json({ message: "Error saving message" });
      }
    });
  };