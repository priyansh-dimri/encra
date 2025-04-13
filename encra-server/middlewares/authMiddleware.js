const { check, validationResult } = require("express-validator");

exports.validateRegister = [
  check("username").trim().notEmpty().withMessage("Username is required."),

  check("email")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters long."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
