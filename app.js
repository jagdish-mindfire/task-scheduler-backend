require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger-doc");
const jwt = require('jsonwebtoken');

require("./config/mongo-db");
const taskEmitter = require("./cron/");

// Middleware to parse JSON and urlencoded request bodies
const globalErrorHandler = require("./middleware/globalErrorHandler.js");

global.asyncWrapper = require("./middleware/asyncWrapper.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Allowing All cors
app.use(cors());

//Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get("/", (req, res) => {
  res.send("Welcome To task Scheduler APIs");
});

app.use("/auth", require('./routes/auth.js'));
app.use("/task", require('./routes/task.js'));

app.use("/notification",require('./routes/notification.js'))

app.get("/live-notifications",cors(),(req, res) => {
  const token = req.query.token;
  const decodedToken = jwt.decode(token);
  console.log(decodedToken);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendTasks = (tasks) => {
    console.log(tasks);
    const tasksToSend = tasks.filter((task=>{
      return task.uid === decodedToken.uid;
    }));
    res.write(`data: ${JSON.stringify(tasksToSend)}\n\n`);
};

taskEmitter.on('incompleteTasksFound', sendTasks);

  req.on('close', () => {
        // taskEmitter.off('incompleteTasksFound', sendTasks);
        res.end();
    });

});


// Global Error Handler

app.use(globalErrorHandler);

module.exports = app;
