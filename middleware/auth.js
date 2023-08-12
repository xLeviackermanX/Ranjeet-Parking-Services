const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    console.log("not here")
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // const decodedToken = "LeviAckerman5525"
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next(new ErrorResponse("No user found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error is , ", error)
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

module.exports = { protect };
