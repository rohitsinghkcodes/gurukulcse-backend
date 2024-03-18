import express from "express";
import {
  createVideoController,
  getVideosController,
  getSingleVideoController,
  deleteVideoController,
  updateVideoController,
  videoCountController,
  searchVideoController,
  courseVideoController,
  
} from "../controllers/videoController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

//router object
const router = express.Router();

//^ ######## ROUTES ########
//~ CREATE NEW Video
router.post(
  "/create-video",
  requireSignIn,
  isAdmin,
  formidable(),
  createVideoController
);

//~ UPDATE Video
router.put(
  "/update-video/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateVideoController
);

//~ GET ALL VideoS
router.get("/get-videos", getVideosController);

//~ GET SINGLE Video
router.get("/get-single-video/:slug", getSingleVideoController);

//~ DELETE Video
router.delete(
  "/delete-video/:pid",
  requireSignIn,
  isAdmin,
  deleteVideoController
);


//~ COUNT Video
router.get("/video-count", videoCountController);

//~  SEARCH VideoS
router.get("/search/:keyword", searchVideoController);

//~  category VideoS-main
router.get("/course-video/:slug", courseVideoController);

//exporting the routers
export default router;
