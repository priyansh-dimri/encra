const csrf = require("csurf");

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None"
  },
});

module.exports = csrfProtection;
