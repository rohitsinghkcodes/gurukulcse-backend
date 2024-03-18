import courseModel from "../models/courseModel.js";
import videoModel from "../models/videoModel.js";
import slugify from "slugify";
import fs from "fs";

//* CREATE NEW COURSE CONTROLLER || POST
export const createCourseController = async (req, res) => {
  try {
    const { name, description } = req.fields;
    const { image } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required!" });
      case !description:
        return res.status(500).send({ error: "description is required!" });
      case image && image.size > 1000000:
        return res
          .status(500)
          .send({ error: "image is required and should be less than 1MB!" });
    }

    const existingCourse = await courseModel.findOne({ name });

    if (existingCourse) {
      return res.status(400).send({
        msg: "Course already exists!",
      });
    }

    const course = await new courseModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (image) {
      course.image.data = fs.readFileSync(image.path);
      course.image.contentType = image.type;
    }
    await course.save();

    res.status(201).send({
      success: true,
      msg: "New Course Created.",
      course,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error in Course Creation!", err });
  }
};

//* UPDATE Course CONTROLLER
export const updateCourseController = async (req, res) => {
  try {
    const { name, description } = req.fields;
    const { image } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required!" });
      case !description:
        return res.status(500).send({ error: "description is required!" });
      case image && image.size > 1000000:
        return res
          .status(500)
          .send({ error: "image is required and should be less than 1MB!" });
    }

    const { id } = req.params;
    const course = await courseModel.findByIdAndUpdate(
      id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (image) {
      course.image.data = fs.readFileSync(image.path);
      course.image.contentType = image.type;
    }
    await course.save();

    res.status(201).send({
      success: true,
      msg: "Course Updated Successfully",
      course,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while updating Course!", err });
  }
};

//* GET ALL Courses CONTROLLER
export const courseController = async (req, res) => {
  try {
    const courses = await courseModel.find({}).select("-image");
    
    res.status(200).send({
      success: true,
      msg: "Courses Fetched Successfully!",
      courses,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while fetching Courses!", err });
  }
};

//* GET SINGLE Course CONTROLLER
export const getSingleCourseController = async (req, res) => {
  try {
    const course = await courseModel
      .findOne({ slug: req.params.slug })
      .select("-image");

    if (course) {
      res.status(200).send({
        success: true,
        msg: "Course Fetched Successfully!",
        course,
      });
    } else {
      res
        .status(400)
        .send({ success: false, msg: "Course not available", err });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while fetching Course!", err });
  }
};

//* COURSE IMAGE CONTROLLER || GET
export const courseImageController = async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.cid).select("image");

    if (course.image.data) {
      res.set("Contect-type", course.image.contentType);
      return res.status(200).send(course.image.data);
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error While Fetching Course img!", err });
  }
};

//! DELETE Course CONTROLLER
export const deleteCourseController = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseModel.findByIdAndDelete(id).select("-image");
    res.status(200).send({
      success: true,
      msg: "Course Deleted Successfully!",
      course,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while deleting Course!", err });
  }
};

//! delete COURSE WITH VIDEOS CONTROLLER || DELETE
export const courseVideosDeleteController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await videoModel.deleteMany({ course: id });
    const deletedCourse = await courseModel
      .findByIdAndDelete(id)
      .select("-image");
    res.status(200).send({
      success: true,
      msg: "Successfully deleted all videos in the course with course",
      deletedCourse: deletedCourse,
      deletedVideosCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting documents:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting documents" });
  }
};
