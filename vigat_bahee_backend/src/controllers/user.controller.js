import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler }  from "../utils/asyncHandler.js"


export const registoruser = asyncHandler(async(req, res) => 
    {
    let savedata = new User(req.body);
     savedata.save();
     res.send("user registered successfully");
   }
)
