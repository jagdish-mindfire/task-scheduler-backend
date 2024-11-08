require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const jwt = require('jsonwebtoken');
const socketIo = require("socket.io");
const http = require("http");
const swaggerDocs = require("./swagger-doc");

require("./config/mongo-db");
const taskEmitter = require("./jobs/");

const globalErrorHandler = require("./middleware/global-error-handler.js");

// Making asyncWrapper Global
global.asyncWrapper = require("./middleware/async-wrapper.js");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST","PATCH","DELETE"], 
    credentials: true,
  },
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get("/", (req, res) => {
  res.json({message:"Welcome To task Scheduler APIs"});
});

app.use("/auth", require('./routes/auth.route.js'));
app.use("/user", require('./routes/user.route.js'));
app.use("/tasks", require('./routes/task.route.js'));
app.use("/notifications",require('./routes/notification.route.js'));

io.on("connection", async (socket) => {
  
  const token = socket.handshake.query?.token;
  const decodedToken = jwt.decode(token);
  const sendTasks = (tasks) => {
    
    const tasksToSend = tasks.filter((task=>{
      return task.uid === decodedToken.uid;
    }));
 
    socket.emit("notification", { data : tasksToSend });
    
  };

  taskEmitter.on('incompleteTasksFound', sendTasks);
});


// Global Error Handler
app.use(globalErrorHandler);

module.exports = server;
