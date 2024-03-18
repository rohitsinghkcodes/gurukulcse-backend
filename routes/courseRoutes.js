import express from "express";
import {
  createCourseController,
  updateCourseController,
  courseController,
  getSingleCourseController,
  deleteCourseController,
  courseImageController,
  courseVideosDeleteController,
} from "../controllers/courseController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

//router object
const router = express.Router();

//^ ######## ROUTES ########
//~ CREATE CATEGORY
router.post(
  "/create-course",
  requireSignIn,
  isAdmin,
  formidable(),
  createCourseController
);

//~ UPDATE COURSE
router.put(
  "/update-course/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateCourseController
);

//~ GET ALL COURSE
router.get("/get-courses", courseController);

//~ GET SINGLE COURSE
router.get("/get-single-course/:slug", getSingleCourseController);

//~ GET PRODUCT IMAGE
router.get("/course-image/:cid", courseImageController);

//! DELETE COURSE
router.delete(
  "/delete-course/:id",
  requireSignIn,
  isAdmin,
  deleteCourseController
);

//! DELETE COURSE WITH VIDEOS
router.delete(
  "/delete-complete-course/:id",
  requireSignIn,
  isAdmin,
  courseVideosDeleteController
);

//exporting the routers
export default router;
