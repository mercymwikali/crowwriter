require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const {logger, logEvents} = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();

//middleware
app.use(logger);

app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());

//static files 
app.use("/", express.static(path.join(__dirname, "public")));

//testing server running
app.get("/", (req, res)=>{
res.send("connection success");
})

//orders route
const orderRouter = require("./routes/OrdersRoute");
app.use("/orders", orderRouter);

//users route
const userRouter = require("./routes/UsersRoute");
app.use("/users", userRouter);

const authRouter = require("./routes/authRoutes");
app.use("/auth", authRouter);


app.use(errorHandler);


app.listen(process.env.PORT, () => {
  console.log("Server started on port:", process.env.PORT);
});
