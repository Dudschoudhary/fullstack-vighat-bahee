import express,{urlencoded} from 'express'
import cors from "cors"
import userRouter from "./routes/user.route.js";

let app = express();

app.use(express.json());

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(urlencoded({extended: true} ))

app.use(express.static("public"));

app.use(userRouter);


export default app;


