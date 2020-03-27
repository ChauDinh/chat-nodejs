# Chat Application with Node.js and Socket.IO

## Agenda

- Create the template with HTML/CSS/JS

- Create the server (httpServer) with Node.js and Express.js

- Implement Socket.io when client connect to server and emit/receive messages

- Deployment with Docker

## Deployment steps

- Deployment:
  1. Setup server (phisically, cloud: create VPS - IP address v4)
  2. Setup environment
     - Setup NodeJS
     - Setup yarn (npm)
     - Copy code to server (compile - minify - zip), `ssh-copy`
     - Install dependencies `yarn install` or `npm install`. DON'T install devdependencies, ex: `nodemon`- Setup NODE_ENV="production" or `yarn install --production`
     - Run node `node index.js`
     - Install `pm2` - a npm package to run background
  3. Run app (pm2)
  4. Out server

### Build Docker Image

- Docker image: OS (Linux, nginx server, ...)
- Build docker image:
  - Choosing operating system
  - Setup environment
  - Copy code
  - Choose PORT for running app and expose this PORT
