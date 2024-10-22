const userResolvers = require('./user.resolvers');
const taskResolvers = require('./task.resolvers');
const notificationResolvers = require('./notification.resolvers');

module.exports = {
  Query: {
    getAllTasks :  taskResolvers.getAllTasks,
    getOneTask :  taskResolvers.getOneTask,    
    getAllNotifications : notificationResolvers.getAllNotifications, 
  },
  
  Mutation: {
    signup: userResolvers.signup,
    login: userResolvers.login,
    refreshToken : userResolvers.refreshToken,
    logout : userResolvers.logout,

    createTask :  taskResolvers.createTask,
    updateTask :  taskResolvers.updateTask,
    deleteTask :  taskResolvers.deleteTask,
    
    markNotificationRead: notificationResolvers.markNotificationRead,
    deleteNotifications : notificationResolvers.deleteNotifications
  },
};
