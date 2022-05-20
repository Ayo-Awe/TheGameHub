const {
  requireAuth,
  SocketCookieParser,
  SocketSession,
} = require("../Middleware/socketMiddleware");

// const { Server } = require("socket.io");
// const io = new Server();
const uniqid = require("uniqid");
module.exports = (io) => {
  const tictactoe = io.of("/tictactoe");
  // middlewares
  tictactoe.use(SocketCookieParser);
  tictactoe.use(requireAuth);
  tictactoe.use(SocketSession);

  // socket connection

  tictactoe.on("connection", async function (socket) {
    // notify opponent that this user has returned to game

    if (socket.gameRoom) {
      socket.to(socket.gameRoom).emit("player returned", socket.username);
    }

    console.log("socket connnected to tictactoe", socket.username);
    socket.join(socket.userid);

    socket.emit("hello", socket.username);

    // play with random user event
    socket.on("play:random-user", randomUserHandler);

    // play with a friend event
    socket.on("play:friend", friendHandler);

    // fired after player has played
    socket.on("next-player", nextPlayerHandler);

    socket.on("gameOver", function (data) {
      // ends the game
      // the game is ended if a user wins or they draw
    });

    socket.on("disconnect", async () => {
      // remove socket from the lobby
      socket.leave("lobby");
      console.log("client disconnected", socket.username);
    });
  });

  const randomUserHandler = async function (data) {
    {
      const socket = this;
      // get all users in lobby
      const playersInLobby = await tictactoe.in("lobby").fetchSockets();

      // check if there are users in lobby and this user isn't in the lobby
      if (playersInLobby.length > 0 && !playersInLobby.includes(socket)) {
        const gameRoom = uniqid("gameroom");
        const player = playersInLobby[0]; // first player in lobby

        // remove matched player from lobby
        player.leave("lobby");

        // add players to a new game room
        socket.join(gameRoom);
        socket.gameRoom = gameRoom;
        player.join(gameRoom);
        player.gameRoom = gameRoom;

        // notify players of found user
        player.emit(
          "found match",
          socket.userid,
          socket.username,
          {
            start: true,
            player: "X",
          },
          gameRoom
        );

        socket.emit(
          "found match",
          player.userid,
          player.username,
          {
            start: false,
            player: "O",
          },
          gameRoom
        );
      } else {
        // add this user to lobby & notify user to wait
        socket.join("lobby");
        socket.emit("waiting in lobby", "waiting");
      }
    }
  };

  const friendHandler = async function (data) {
    const socket = this;
    //check if friend is online
    const friendSockets = await io.of("/users").in(data.userid).allSockets();
    const friendIsOnline = friendSockets.size !== 0;

    if (friendIsOnline) {
      // send friend a game request and add this player to the new gameroom
      const gameroom = uniqid();
      tictactoe
        .to(data.userid)
        .emit("game request", socket.userid, socket.username, gameroom);
      socket.join(gameroom);
    } else {
      socket.emit("friend offline", data.userid);
    }
  };

  const nextPlayerHandler = function (data) {
    const socket = this;
    // emits an event to the other player
    socket.to(socket.gameRoom).emit("turn", data);
    // socket.to(socket.userid).to(data.roomid).emit("turn", { changes: "" });
    // socket.session.room = "something";
  };
};
