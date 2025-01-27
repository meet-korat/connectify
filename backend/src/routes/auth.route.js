import express from 'express';
import { signup,login,logout,updateProfile,CheckAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router=express();

router.post('/signup' , signup);

router.post('/logout'  , logout);

router.post('/login' , login);

router.put('/update-profile',protectRoute,updateProfile);

router.get('/check',protectRoute,CheckAuth);

export default router;