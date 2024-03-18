import courseModel from "../models/courseModel.js";
import videoModel from "../models/videoModel.js";
import slugify from "slugify";
import fs from "fs";
import notesModel from "../models/notesModel.js";

//? ADD NEW SUB NOTES CONTROLLER || POST
export const addNotesController = async (req, res) => {
  try {
    const { name, description, pdfLink } = req.fields;
    const { image } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required!" });
      case !description:
        return res.status(500).send({ error: "description is required!" });
      case !pdfLink:
        return res.status(500).send({ error: "link is required!" });
      case image && image.size > 1000000:
        return res
          .status(500)
          .send({ error: "image is required and should be less than 1MB!" });
    }

    const existingNotes = await notesModel.findOne({ name });

    if (existingNotes) {
      return res.status(400).send({
        msg: "This subject notes are already available in db!",
      });
    }

    const notes = await new notesModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (image) {
      notes.image.data = fs.readFileSync(image.path);
      notes.image.contentType = image.type;
    }
    await notes.save();

    res.status(201).send({
      success: true,
      msg: "New Subject Notes Added Successfully.",
      notes,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error in addig new notes!", err });
  }
};

//? UPDATE Course CONTROLLER || PUT
export const updateNotesController = async (req, res) => {
  try {
    const { name, description, pdfLink } = req.fields;
    const { image } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required!" });
      case !description:
        return res.status(500).send({ error: "description is required!" });
      case !pdfLink:
        return res.status(500).send({ error: "link is required!" });
      case image && image.size > 1000000:
        return res
          .status(500)
          .send({ error: "image is required and should be less than 1MB!" });
    }

    const { id } = req.params;
    const notes = await notesModel.findByIdAndUpdate(
      id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (image) {
      notes.image.data = fs.readFileSync(image.path);
      notes.image.contentType = image.type;
    }
    await notes.save();

    res.status(201).send({
      success: true,
      msg: "Subject Notes Updated Successfully.",
      notes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      msg: "Error while updating the subject notes details!",
      err,
    });
  }
};

//* GET ALL notes CONTROLLER || GET
export const fetchAllNotesController = async (req, res) => {
  try {
    const all_sub_notes = await notesModel.find({}).select("-image");

    res.status(200).send({
      success: true,
      msg: "Notes Fetched Successfully!",
      all_sub_notes,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while fetching Notes!", err });
  }
};

//* GET SINGLE SUBJECT NOTES CONTROLLER || GET
export const getSingleSubNoteController = async (req, res) => {
  try {
    const notes = await notesModel
      .findOne({ slug: req.params.slug })
      .select("-image");

    if (notes) {
      res.status(200).send({
        success: true,
        msg: "Notes Fetched Successfully!",
        notes,
      });
    } else {
      res.status(400).send({
        success: false,
        msg: "Sorry, this subject notes are not available yet!",
        err,
      });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while fetching Notes!", err });
  }
};

//* COURSE IMAGE CONTROLLER || GET
export const subImageController = async (req, res) => {
  try {
    const notes = await notesModel.findById(req.params.id).select("image");

    if (notes.image.data) {
      res.set("Contect-type", notes.image.contentType);
      return res.status(200).send(notes.image.data);
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error While Fetching notes img!", err });
  }
};

//! DELETE notes CONTROLLER || DELETE
export const deleteSubNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await notesModel.findByIdAndDelete(id).select("-image");
    res.status(200).send({
      success: true,
      msg: "Notes Deleted Successfully!",
      notes,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while deleting the notes!", err });
  }
};
