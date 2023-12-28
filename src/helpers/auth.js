const jwt = require("jsonwebtoken");
const generateToken = (payload) => {
  const verifyOpts = {
    expiresIn: "1d",
    issuer: "hirejob_backend",
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts);
  return token;
};

module.exports = { generateToken };
