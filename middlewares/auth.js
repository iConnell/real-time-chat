const jwt = require("jsonwebtoken");
const { UnauthorisedError } = require("../errors");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorisedError("No Token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username, id } = decoded;
    req.user = { username, id };
    next();
  } catch (error) {
    throw new UnauthorisedError("Permission Denied");
  }
};

const socketMiddleware = async (socket, next) => {
  const authHeader = socket.handshake.headers.authorisation;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new UnauthorisedError("No authorisation token"));
  }

  try {
    const token = authHeader.split(" ")[1];
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username, id } = decoded;
    socket.user = { username, id };
    next();
  } catch (error) {
    //next(new Error("Invalid token"));
    next();
  }
};

module.exports = { authMiddleware, socketMiddleware };
