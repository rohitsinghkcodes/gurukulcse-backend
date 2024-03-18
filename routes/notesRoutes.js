import express from "express";
import {
  addNotesController,
  updateNotesController,
  fetchAllNotesController,
  getSingleSubNoteController,
  subImageController,
  deleteSubNoteController,
} from "../controllers/notesController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

//router object
const router = express.Router();

//^ ######## ROUTES ########
//~ CREATE notes
router.post(
  "/add-notes",
  requireSignIn,
  isAdmin,
  formidable(),
  addNotesController
);

//~ UPDATE notes
router.put(
  "/update-notes/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateNotesController
);

//~ GET ALL notes
router.get("/get-all-notes", fetchAllNotesController);

//~ GET SINGLE notes
router.get("/get-single-sub-notes/:slug", getSingleSubNoteController);

//~ GET notes IMAGE
router.get("/sub-image/:id", subImageController);

//! DELETE notes
router.delete(
  "/delete-sub-notes/:id",
  requireSignIn,
  isAdmin,
  deleteSubNoteController
);

//exporting the routers
export default router;
