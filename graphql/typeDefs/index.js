const { gql } = require("apollo-server");

module.exports = gql`

  type Notification {
    _id: ID!
    taskId: ID!
    notificationType: String!
    isRead: Boolean!,
    createdAt: String!
    updatedAt : String!
  }

  type LoginResponse {
    message: String!
    refreshToken: String!
  }

  type refreshTokenResponse {
    accessToken: String!
  }
  type messageResponse {
    message: String!
  }

  type Task {
    _id: ID!
    title: String!
    description: String!
    isCompleted: Boolean!
    dueDate:String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getAllTasks(sort: String): [Task]
    getOneTask(taskId: ID!): Task!
    getAllNotifications: [Notification]!
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): messageResponse!
    login(email: String!, password: String!): LoginResponse!
    refreshToken(refreshToken: String!): refreshTokenResponse!
    logout(refreshToken: String!): messageResponse!

    createTask(title: String!, description: String!, dueDate: String!): Task!

    updateTask(
      taskId: ID!
      title: String
      description: String
      due_date: String
    ): Task!
    deleteTask(taskId: ID!): messageResponse!
    markNotificationRead(notificationIds:[ID!]!): messageResponse!
    deleteNotifications(notificationIds:[ID!]!):messageResponse!
  }
`;
