import express,{urlencoded} from 'express'
import cors from "cors"
import userRouter from "./routes/user.route.js";
import baheeRouter from "./routes/baheeRoutes.js"
import personalbaheeRouter from './routes/personalbahee.route.js';
import cookieParser from 'cookie-parser';   

let app = express();

app.use(express.json());

app.use(cors({
    origin: "*",
    credentials: true
}));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "You are live"
    })
})

app.use(urlencoded({extended: true} ))
app.use(cookieParser());

app.use(express.static("public"));

app.use(userRouter);
app.use(baheeRouter)
app.use(personalbaheeRouter)


export default app;
