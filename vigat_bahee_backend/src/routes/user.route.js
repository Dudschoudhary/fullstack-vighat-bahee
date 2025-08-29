import express from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = express.Router();


router.post('/register', (req, res, next) => {
    console.log("inside middleware");
    next();
}, registerUser);


export default router;
