import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username:{
            type: String,
            // required: true,
            // unique: true,
            // lowercase: true,
            trim: true
        },
        email:{
            type: String,
            // required: true,
            // unique: true,
            lowercase: true,
            trim: true
        },
        fullname:{
            type: String,
            // required: true,
            // unique: true,
            // lowercase: true,
            trim: true
        },
        password:{
            type: String,
            // required: true,
        },
        phone:{
            type: String,
            // required: true,
            trim: true
        }
    },
    {
        timestamps: true,
    }
)

export const User = mongoose.model("users",userSchema)