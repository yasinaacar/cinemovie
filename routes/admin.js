const express=require("express");
const router=express.Router();

const adminController=require("../controllers/admin-controller");
const imageUpload=require("../helpers/image-upload");
const isAdmin=require("../middlewares/is-admin")


//film işlemleri
router.get("/movie/create", isAdmin,adminController.get_movie_create);
router.post("/movie/create", imageUpload.upload.single("movieimg"),adminController.post_movie_create);
router.get("/movie/edit/:movieid/add-actor", isAdmin, adminController.get_actor_for_movie);
router.post("/movie/edit/:movieid/add-actor", adminController.post_actor_for_movie);
router.get("/movie/edit/:movieid", isAdmin, adminController.get_movie_edit);
router.post("/movie/edit/:movieid", imageUpload.upload.single("movieimg"),adminController.post_movie_edit);
router.get("/movie/delete/:movieid",  isAdmin,adminController.get_movie_delete);
router.post("/movie/delete/:movieid", adminController.post_movie_delete);
router.get("/movies", isAdmin, adminController.get_movies);

//kategori-tür işlemleri
router.get("/category/create", isAdmin, adminController.get_category_create);
router.post("/category/create", adminController.post_category_create);
router.get("/category/edit/:categoryid", isAdmin, adminController.get_category_edit);
router.post("/category/edit/:categoryid", adminController.post_category_edit);
router.post("/admin/category/movie/remove/", adminController.post_remove_movie_from_category);
router.get("/category/delete/:categoryid", isAdmin, adminController.get_category_delete);
router.post("/category/delete/:categoryid", adminController.post_category_delete);
router.get("/categories",  isAdmin,adminController.get_categories);

//aktör işlemleri
router.get("/actor/create", isAdmin, adminController.get_actor_create);
router.post("/actor/create", adminController.post_actor_create);
router.get("/actor/edit/:actorid", isAdmin, adminController.get_actor_edit);
router.post("/actor/edit/:actorid", adminController.post_actor_edit);
router.get("/actor/delete/:actorid", isAdmin, adminController.get_actor_delete);
router.post("/actor/delete/:actorid", adminController.post_actor_delete);
router.get("/actors", isAdmin, adminController.get_actors);

//salon türü işlemleri
router.get("/saloontype/create", isAdmin, adminController.get_saloontype_create);
router.post("/saloontype/create", adminController.post_saloontype_create);
router.get("/saloontype/edit/:saloontypeid", isAdmin, adminController.get_saloontype_edit);
router.post("/saloontype/edit/:saloontypeid", adminController.post_saloontype_edit);
router.get("/saloontype/delete/:saloontypeid", isAdmin, adminController.get_saloontype_delete);
router.post("/saloontype/delete/:saloontypeid", adminController.post_saloontype_delete);
router.get("/saloontypes",  isAdmin,adminController.get_saloontypes);

//salon işlemleri
router.get("/saloon/create", isAdmin, adminController.get_saloon_create);
router.post("/saloon/create", adminController.post_saloon_create);
router.get("/saloon/edit/:saloonid", isAdmin, adminController.get_saloon_edit);
router.post("/saloon/edit/:saloonid", adminController.post_saloon_edit);
router.get("/saloon/delete/:saloonid", isAdmin, adminController.get_saloon_delete);
router.post("/saloon/delete/:saloonid", adminController.post_saloon_delete);
router.get("/saloons",  isAdmin,adminController.get_saloons);



//seans işlemleri
router.get("/showtime/create", isAdmin, adminController.get_showtime_create);
router.post("/showtime/create", adminController.post_showtime_create);
router.get("/showtime/edit/:showtimeid", isAdmin, adminController.get_showtime_edit);
router.post("/showtime/edit/:showtimeid", adminController.post_showtime_edit);
router.get("/showtime/delete/:showtimeid", isAdmin, adminController.get_showtime_delete);
router.post("/showtime/delete/:showtimeid", adminController.post_showtime_delete);
router.get("/showtimes", isAdmin, adminController.get_showtimes);

//rol işlemleri
router.get("/role/create", isAdmin, adminController.get_role_create);
router.post("/role/create", adminController.post_role_create);
router.get("/role/edit/:roleid", isAdmin, adminController.get_role_edit);
router.post("/role/edit/:roleid", adminController.post_role_edit);
router.get("/role/delete/:roleid", isAdmin, adminController.get_role_delete);
router.post("/role/delete/:roleid", adminController.post_role_delete);
router.get("/roles",  isAdmin,adminController.get_roles);

//kullanıcı işlemleri
router.get("/user/edit/:userid", isAdmin, adminController.get_user_edit);
router.post("/user/edit/:userid", adminController.post_user_edit);
router.get("/users",  isAdmin,adminController.get_users);

module.exports=router;