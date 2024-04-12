const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();

var allowedOrigins = ["http://localhost:5173"];

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

//orders route
const orderRouter = require("./routes/OrdersRoute");
app.use("/orders", orderRouter);

//users route
const userRouter = require("./routes/UsersRoute");
app.use("/users", userRouter);

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
