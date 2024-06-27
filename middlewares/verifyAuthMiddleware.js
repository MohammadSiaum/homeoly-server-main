const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");

const verifyAuthMiddleware = async(req, res, next) => {
  let token = req?.cookies?.token || req?.headers?.token;
  // console.log(token);

  if (!token) {
    return res.status(401).json({ status: "unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, decoded) {
    if (err) {
      // console.log(err);
      return res.status(401).json({ status: "unauthorized" });
    } 
    else {

      // // console.log("decoded: ", decoded);
      // const doctor = await Doctor.findOne({userId: decoded.userId});
      // // console.log(decoded.userId, 'decoded user id');
      // if (!doctor) {

      //   return res.status(401).json({ status: "unauthorized" });

      // } else {

      //   req.headers.doctor_id = doctor._id;
      //   next();
      // }
      req.headers.userId = decoded.userId;
      next();
      
    }
  });
};

module.exports = verifyAuthMiddleware;
