const { check, validationResult } = require("express-validator");

exports.validateSendMessage = [
  check("content")
    .trim()
    .notEmpty()
    .withMessage("Message content is required.")
    .isLength({ max: 10000 })
    .withMessage("Message is too long."),

  check("messageType")
    .trim()
    .notEmpty()
    .withMessage("Message type is required.")
    .isIn(["text"])
    .withMessage("Invalid message type."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
