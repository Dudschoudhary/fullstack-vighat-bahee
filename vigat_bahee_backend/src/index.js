import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import {DB_NAME} from '../constant.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env before importing modules that rely on it (e.g., emailService transporter)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

(async () => {
    try{
        const app = (await import('./app.js')).default;
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
