import express from "express";
import { registoruser } from "../controllers/user.controller.js";

const router = express.Router();


router.post('/register', (req, res, next) => {
    console.log("inside middleware");
    next();
}, registoruser);


export default router;
