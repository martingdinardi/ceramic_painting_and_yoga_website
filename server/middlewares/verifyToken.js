const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const admin = jwt.verify(token, process.env.JWT_SEC);
    req.admin = admin;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/");
  }
};

module.exports = { verifyToken };
