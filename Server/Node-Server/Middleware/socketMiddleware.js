require("dotenv").config();
const cookieParser = require("cookie");
const jwt = require("jsonwebtoken");
const { FindSession, CreateSession } = require("../socketSession");

// The socketCookieParser middleware must occur before the requireAuth middleware
// as it depends on the cookie property
const requireAuth = (socket, next) => {
  if (socket.cookies && socket.cookies.token) {
    try {
      // if jwt is valid set socket userid and username properties
      jwt.verify(socket.cookies.token, process.env.SECRET, (err, decoded) => {
        socket.userid = decoded.userid;
        socket.username = decoded.username;
        if (socket.handshake.query.gameRoom)
          socket.gameRoom = socket.handshake.query.gameRoom;
      });
      next();
    } catch (error) {
      next(new Error("You need to be logged in"));
      console.log(error);
    }
  } else {
    next(new Error("You need to be logged in"));
  }
};

// The socketCookieParser middleware must occur before the requireAuth middleware
const SocketCookieParser = (socket, next) => {
  const { cookie } = socket.request.headers;
  if (cookie) {
    // parse cookies and assign them on the socket object
    const cookies = cookieParser.parse(cookie);
    socket.cookies = cookies;
  }
  next();
};

// This session middleware must come after the requireAuth as socket.userid must exist
const SocketSession = async (socket, next) => {
  if (socket.userid) {
    try {
      // check for existing session and create one if none
      const session = await FindSession(socket.userid);

      if (session) {
        socket.session = session;
        next();
      } else {
        const newSession = await CreateSession(socket.userid);
        if (newSession) {
          socket.session = newSession;
          next();
        }
      }
    } catch (error) {
      next(error);
      console.log(error);
    }
  } else {
    next(new Error("You need to be logged in"));
  }
};
module.exports = { requireAuth, SocketCookieParser, SocketSession };
