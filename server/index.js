const express = require("express");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();

var allowedOrigins = ["https://crowwriter.vercel.app"];

var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  if (allowedOrigins.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.use(express.json());

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

app.listen(process.env.PORT, () => {
  console.log("Server started on port:", process.env.PORT);
});
