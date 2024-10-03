# Task Scheduler Backend

This is the backend of the Task Scheduling App, built with Node.js and Express. It handles user authentication, task creation, editing, deletion, and notifications for tasks.

## Deployed Link 
```bash
https://task-scheduler-api.chickenkiller.com
```

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Functionalities](#functionalities)
- [API Documentation](#api-Documentation)

## Getting Started

To get a copy of the project up and running on your local machine, follow the instructions below.

### Clone the Repository

```bash
git clone git@github.com:jagdish-mindfire/task-scheduler-backend.git
```
Navigate into the cloned repository:


```bash
cd task-scheduler-backend
```

## Installation
Once inside the project directory, run the following command to install all the necessary dependencies:

```bash
npm install
```
## Environment Variables
Before running the app locally, create a .env file in the root of the project and fill in the required environment variables based on the .env.example file provided.

```bash
MONGO_DB_STRING=mongodb://localhost:27017/task-scheduler
REFRESH_TOKEN_EXPIRY=10  #in days
ACCESS_TOKEN_EXPIRY=150m
JWT_PRIVATE_KEY=my-secret-key
PORT=3000
SALT_ROUNDS=11
```

## Running the App
Once inside the project directory, run the following command to install all the necessary dependencies:

To start the server locally, use the following command:

```bash
node index.js
```

## Functionalities
* **User Registration :** Users can create a new account.
* **User Login :** Users can log in using their credentials.
* **Task Management :**
  * **Create Task :** Users can create a task with a title, description, and due date.
  * **Edit Task :** Users can edit tasks they’ve created.
  * **Delete Task:** Users can delete tasks they no longer need.
* **Authentication :** Users must be authenticated via a valid access token to create, edit, or delete tasks.

## API Documentation
you can access all api and the documentation from this link :

```bash
https://task-scheduler-api.chickenkiller.com/api-docs/
```