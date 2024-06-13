const jwt = require("jsonwebtoken");

const verifyAuthMiddleware = (req, res, next) => {
  let token = req?.cookies?.token || req?.headers?.token;

  if (!token) {
    return res.status(401).json({ status: "unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
    if (err) {
      return res.status(401).json({ status: "unauthorized" });
    } else {
      req.headers.userId = decoded.userId;
      next();
    }
  });
};

module.exports = verifyAuthMiddleware;
