var jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../uri");

const fetchuser = (req, res, next) => {
  // Get user from JWT Token and add ID to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please auth with valid token" });
  }
  try {
    const jwtVerification = jwt.verify(token, JWT_SECRET);
    console.log(jwtVerification);
    req.user = jwtVerification.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please auth with valid token" });
  }
};

module.exports = fetchuser;
