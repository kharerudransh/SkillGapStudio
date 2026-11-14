
const { body, validationResult } = require("express-validator");

function validate(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
}

const validateUserRegister = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("contactNo")
        .trim()
        .notEmpty()
        .withMessage("Contact number is required")
        .isNumeric()
        .withMessage("Contact number must contain only digits")
        .isLength({ min: 10, max: 10 })
        .withMessage("Contact number must be 10 digits long"),

    body("profession")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Profession cannot be empty"),

    body("age")
        .notEmpty()
        .withMessage("Age is required")
        .isInt({ min: 18, max: 80 })
        .withMessage("Age must be between 18 and 80"),

    validate
];
const validateLoginUser = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    validate
];
module.exports = { validateUserRegister, validateLoginUser };
