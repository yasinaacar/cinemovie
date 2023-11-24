const express=require("express");
const router=express.Router();
const userController=require("../controllers/user-controller");

const isCustomer=require("../middlewares/is-customer");

router.get("/on-display/movie/:movieid", userController.get_choose_saloon);
router.get("/on-display/movie/:movieid/saloon/:saloonid/showtimes", userController.get_choose_showtime);
router.get("/on-display/movie/:movieid/saloon/:saloonid/showtimes/:showtimeid", isCustomer, userController.get_buy_ticket);
router.post("/on-display/movie/:movieid/saloon/:saloonid/showtimes/:showtimeid", userController.post_buy_ticket);
router.get("/on-display/category/:categoryid", userController.get_on_display_with_category);
router.get("/", userController.get_on_display);


module.exports=router;