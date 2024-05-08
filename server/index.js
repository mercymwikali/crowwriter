require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const {logger, logEvents} = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();

// Middleware
app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://crowwriter.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});


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
const usersRoute= require("./routes/UsersRoute")
app.use("/users", usersRoute)

const authRouter = require("./routes/authRoutes");
app.use("/auth", authRouter);

const uploadDocumentRoute = require("./routes/uploadsRoutes");
app.use("/uploadFile", uploadDocumentRoute);

const bidsRoute = require("./routes/bidsRoute");
app.use("/bids", bidsRoute);


app.use(errorHandler);


app.listen(process.env.PORT, () => {
  console.log("Server started on port:", process.env.PORT);
});
