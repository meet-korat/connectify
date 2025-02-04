import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { connectDB } from './src/lib/db.js';
import authRoute from './src/routes/auth.route.js';
import messageRoutes from './src/routes/message.routes.js'
import dotenv from 'dotenv';

dotenv.config();
const app=express();

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
    }
))
app.use(cookieParser());   
const PORT=process.env.PORT || 3000;
app.use(express.json());
app.use('/api/auth',authRoute);
app.use('api/message',messageRoutes)

app.listen(PORT , ()=>{
    console.log(`Server is running on port :${PORT}`);
    connectDB();
})