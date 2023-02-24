const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, "shhhhh");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Access denied." });
  }
}

module.exports = authMiddleware;
