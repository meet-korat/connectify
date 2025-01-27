import express from "express";
import {getuserSideBar,getMessages,sendMessages } from "../controllers/message.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const Router=express();

Router.get("/users",protectRoute,getuserSideBar);
Router.get("/:id",protectRoute,getMessages);
Router.post("/sender/:id",protectRoute,sendMessages);
export default Router;