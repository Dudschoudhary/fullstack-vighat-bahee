import express,{urlencoded} from 'express'
import cors from "cors"
import userRouter from "./routes/user.route.js";
import cookieParser from 'cookie-parser';   

let app = express();

app.use(express.json());

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(urlencoded({extended: true} ))
app.use(cookieParser());

app.use(express.static("public"));

app.use(userRouter);


export default app;
