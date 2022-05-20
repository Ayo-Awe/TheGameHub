require("dotenv").config();
const { corsConfig } = require("./Controllers/serverController");
const cors = require("cors");
const TestRouter = require("./Routes/TestRoutes");
const {
  requireAuth,
  SocketCookieParser,
  SocketSession,
} = require("./Middleware/socketMiddleware");
const express = require("express");
const { startRedis } = require("./redis/index");

const uniqid = require("uniqid");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app, { cors: corsConfig });
const io = new Server(server, { cors: corsConfig });

const port = process.env.PORT || 8080; // use port 8080 if environment port is not specified

// Middlewares

// Express middlewares
app.use(express.json());
app.use(cors(corsConfig));
app.use("/test", TestRouter);

require("./Sockets/tictactoe")(io);

io.on("connection", async (socket) => {
  // send all online users to the client
  const users = [];
  for (let [_, userSocket] of io.of("/").sockets) {
    if (userSocket.username !== socket.username)
      users.push({
        userid: userSocket.userid,
        username: userSocket.username,
      });
  }

  socket.emit("users", users);

  // checks if user has other connected sockets and notifies other users
  const matchingSockets = await io.in(socket.userid).allSockets();
  if (matchingSockets.size === 0)
    socket.broadcast.emit("user has joined", socket.userid, socket.username);

  // add socket to its userid room
  socket.join(socket.userid);

  console.log(socket.username);

  socket.on("disconnect", async () => {
    // check if all sockets with this username are disconnected
    const matchingSockets = await io.in(socket.userid).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      socket.broadcast.emit("user has left", socket.userid, socket.username);
    }
  });
});

// start server
server.listen(port, async () => {
  await startRedis();
  console.log(`Listening on port ${port}...`);
});
