require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger-doc");

require("./config/mongo-db");
require("./cron/")
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

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
