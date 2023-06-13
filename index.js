import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors"
import "./src/services/passportSetup.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });
import express from "express";
import * as indexRouter from "./src/modules/index.router.js";
import connectDB from "./DB/connection.js";
import { globalError } from "./src/services/handleError.js";
import session from "express-session";
const app = express();
const port = process.env.PORT;
//convert Buffer Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.sessionSecret,
    saveUninitialized: true.valueOf,
    resave: false,
  })
);
app.use(cors({}))
app.set("views engine", "ejs");
app.use(passport.session());
app.get('/',(req,res)=>{
return res.send('<h1>Home Page</h1>')
})
app.use(`/auth`, indexRouter.authRouter);
app.use(`/user`, indexRouter.userRouter);
app.use(`/product`, indexRouter.productRouter);
app.use(`/category`, indexRouter.categoryRouter);
app.use(`/subCategory`, indexRouter.subcategoryRouter);
app.use(`/review`, indexRouter.reviewsRouter);
app.use(`/coupon`, indexRouter.couponRouter);
app.use(`/cart`, indexRouter.cartRouter);
app.use(`/order`, indexRouter.orderRouter);
app.use(`/brand`, indexRouter.branRouter);
app.use("*", (req, res, next) => {
  res.send("In-valid Routing Plz check url  or  method");
});
// handling error
app.use(globalError);

connectDB();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
