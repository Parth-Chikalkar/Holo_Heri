
const jwt = require("jsonwebtoken");


// CREATE TOKEN
exports.createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d", // token valid for 7 days
  });
};
