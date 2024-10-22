const { ApolloServer } = require("apollo-server");
require("dotenv").config();
require("./config/mongo-db");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// const globalErrorHandler = require("./middleware/global-error-handler.js");

// Making asyncWrapper Global
// global.asyncWrapper = require("./middleware/async-wrapper.js");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: req => req 

  // formatError: (err) => {
  //   return {
  //     message: err.message,
  //     code: err.extensions.code,
  //     fieldErrors: err.extensions.exception.fieldErrors || [],
  //   };
  // },
});

module.exports = server;
