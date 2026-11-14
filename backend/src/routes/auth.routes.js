const { Router } = require("express");
const authController = require("../controller/authController");
const { validateUserRegister,validateLoginUser } = require("../validate/authValidation");
const { authUser } = require("../middleware/authMiddleware");

const authRouter = Router();


//routes
/**
 * @Routes : /api/auth/register
 * @description : User Register
 * @access : Public
 * @method : POST
 */
authRouter.post("/register",validateUserRegister,authController.registerUserController);

/**
 * @Routes : /api/auth/login
 * @description : User Login
 * @access : Public
 * @method : POST
 */
authRouter.post("/login",validateLoginUser,authController.loginUserController);


/**
 * @Route : /api/auth/logout
 * @description : User Logout
 * @access : Private
 * @method : GET
 */
authRouter.get("/logout",authUser,authController.logoutUserController);

/**
 * @Route : /api/auth/getMe
 * @description : get user information
 * @access : Private
 * @method : GET
 */
authRouter.get("/getMe",authUser,authController.getMeController);


module.exports=authRouter; 