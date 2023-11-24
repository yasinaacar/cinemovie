const express=require("express");
const router=express.Router();

const authController=require("../controllers/auth-controler");
const isCustomer = require("../middlewares/is-customer");


router.get("/register", authController.get_register);
router.post("/register", authController.post_register);
router.get("/login", authController.get_log_in);
router.post("/login", authController.post_log_in);
router.get("/forgot-password", authController.get_forgot_password);
router.post("/forgot-password", authController.post_forgot_password);
router.get("/reset-password/:token", authController.get_reset_password);
router.post("/reset-password/", authController.post_reset_password);
router.get("/settings", isCustomer,authController.get_account_settings);
router.post("/settings", authController.post_account_settings);
router.get("/logout", authController.get_logout);

module.exports=router;