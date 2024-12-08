const jwt = require("jsonwebtoken");

const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";

const authMiddleware = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, jwtSecret, {}, (err, info) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = info;
    next();
  });
};

module.exports = authMiddleware;