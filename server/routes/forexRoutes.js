const express = require("express");
const router = express.Router();
const app = express();
const postController = require("../controllers/postController");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/verifyToken");

/* User Routes */
router.get("/", postController.home);
router.get("/post/:id", postController.postPage);
router.get("/nuestro_blog/:page", userController.our_blog);
router.get("/curso_de_ceramica", userController.ceramic_course);
router.get("/curso_de_yoga", userController.yoga_course);
router.get("/curso_de_pintura", userController.painting_course);
router.get("/quienes_somos", userController.who_we_are);
router.post("/enviar_formulario", userController.user_contact);
router.post("/reset_database", postController.refreshDatabase);


/* Admin Routes*/

router.get("/admin/login", adminController.login_home);
router.post("/admin/admin_login/:id", adminController.login_admin);
router.get("/admin/panel/:id/:page", verifyToken, adminController.admin_panel);
router.post("/admin/submit-post/", verifyToken, adminController.submit_post);
router.post("/admin/delete/:id", verifyToken, adminController.delete_post);
router.get("/admin/edit_post/:id", verifyToken, adminController.update_page);
router.post("/admin/edit_post/:id", verifyToken, adminController.update_post);
router.get("/panel/home/", verifyToken, adminController.home);
router.get("/admin/admins", verifyToken, adminController.admin_page);
router.post(
  "/admin/delete_admin/:id",
  verifyToken,
  adminController.delete_admin
);
router.post("/admin/create-admin/", verifyToken, adminController.create_admin);
router.get("/admin/contacts", verifyToken, adminController.contact_page);
router.post(
  "/admin/delete_contact/:id",
  verifyToken,
  adminController.delete_contact
);

module.exports = router;
