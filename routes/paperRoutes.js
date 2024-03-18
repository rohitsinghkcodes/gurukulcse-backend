import express from "express";
import {
  addPaperController,
  updatePaperController,
  paperController,
  getSinglePaperController,
  deletePaperController,
} from "../controllers/paperController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

//router object
const router = express.Router();

//^ ######## ROUTES ########
//~ ADD NEW RESEARCH PAPER
router.post(
  "/add-paper",
  requireSignIn,
  isAdmin,
  formidable(),
  addPaperController
);

//~ UPDATE paper
router.put(
  "/update-paper/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updatePaperController
);

//~ GET ALL RESEARCH PAPERS
router.get("/get-all-papers", paperController);

//~ GET SINGLE paper
router.get("/get-single-paper/:slug", getSinglePaperController);

// //~ GET PRODUCT IMAGE
// router.get("/paper-pdf/:id", paperpdfController);

//! DELETE paper
router.delete(
  "/delete-paper/:id",
  requireSignIn,
  isAdmin,
  deletePaperController
);

//exporting the routers
export default router;
