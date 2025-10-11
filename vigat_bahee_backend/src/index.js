import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from './app.js'; 
import {DB_NAME} from '../constant.js'
dotenv.config();


(async () => {
    try{
        await mongoose.connect(`${process.env.mogodburl}/${DB_NAME}`);
        console.log("connect successfully")

        app.on("error", (err) => {
            console.log("connection error");
        })

        app.listen(process.env.PORT, () => {
            console.log("server running on PORT...", process.env.PORT)
        })
    } catch (error){
        console.log("Error",error.message)
    }
})();