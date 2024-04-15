const express = require("express");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const {logger, logEvents} = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const prisma = new PrismaClient();
const app = express();
console.log(process.env.NODE_ENV);

//middlewares
app.use(logger);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//routes
//testing server running
app.get("/", (req, res)=>{
res.json("connection success");
})

//orders route
const orderRouter = require("./routes/OrdersRoute");
app.use("/orders", orderRouter);

//users route
const userRouter = require("./routes/UsersRoute");
app.use("/users", userRouter);

//auth route
app.use("/auth", require("./routes/authRoutes"));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server started on port:", process.env.PORT);
});