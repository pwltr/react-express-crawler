# react-express-crawler

A project consisting of a React frontend and a Node/Express back-end.

## Running with Docker

- Make sure `docker` and `docker-compose` is installed on your system
- Build the images with `docker build -t client ./client` and `docker build -t api ./api`
- Run `docker-compose up`

Frontend is running on `http://localhost:8080`

Backend is listening on `http://localhost:3000`

## Running for development

For a more rapid development experience it often makes sense to run the project directly on your system.

### Starting the Frontend

Open a terminal and follow these steps:

```
cd client
npm install
npm start
```

This will install all the necessary dependencies for the `client` frontend project and start it up. The app will load up using `parcel`.
Frontend is running on `http://localhost:8080`

### Starting the API

In a separate tab in your terminal, execute the following commands:

```
cd api
npm install
npm run watch
```

This will install all the necessary dependencies and start the node application using `node` and `nodemon`.
Backend is listening on `http://localhost:3000`
