import slugify from "slugify";
import videoModel from "../models/videoModel.js";
import courseModel from "../models/courseModel.js";
import dotenv from "dotenv";

dotenv.config();

//* courseVideo CONTROLLER || GET
export const courseVideoController = async (req, res) => {
  try {
    const course = await courseModel.findOne({ slug: req.params.slug });

    const videos = await videoModel.find({ course }).populate("course");

    if (videos) {
      res.status(200).send({
        success: true,
        msg: "Videos Fetched Successfully!",
        course,
        videos,
      });
    } else {
      res.status(400).send({ success: false, msg: "Videos Not Found", err });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      msg: "Error While Fetching Products!",
      err,
    });
  }
};



//* CREATE NEW VIdeo CONTROLLER || POST
export const createVideoController = async (req, res) => {
  try {
    const { name, description, link, course } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required!" });
      case !description:
        return res.status(500).send({ error: "description is required!" });
      case !link:
        return res.status(500).send({ error: "link is required!" });
      case !course:
        return res.status(500).send({ error: "course is required!" });
    }

    const newVideo = new videoModel({
      ...req.fields,
      slug: slugify(name),
    });

    await newVideo.save();

    res.status(201).send({
      success: true,
      msg: "New Video Added",
      newVideo,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error In Video Addition!", err });
  }
};

//* get all Videos CONTROLLER || GET
export const getVideosController = async (req, res) => {
  try {
    const videos = await videoModel
      .find({})
      .populate("course")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      msg: "All Videos Fetched Successfully!",
      videos_count: videos.length,
      videos,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error While Fetching Videos!", err });
  }
};

//* SINGLE Video CONTROLLER || GET
export const getSingleVideoController = async (req, res) => {
  try {
    const video = await videoModel
      .findOne({ slug: req.params.slug })
      .populate("course");
    if (video) {
      res.status(200).send({
        success: true,
        msg: "video Fetched Successfully!",
        video,
      });
    } else {
      res.status(400).send({ success: false, msg: "video not available", err });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error While Fetching Video!", err });
  }
};

//* DELETE Video CONTROLLER || DELETE
export const deleteVideoController = async (req, res) => {
  try {
    const deletedVideo = await videoModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      msg: "Video Deleted Successfully!",
      deletedVideo,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error While Deleting The Video!", err });
  }
};

//* UPDATE Video CONTROLLER || PUT
export const updateVideoController = async (req, res) => {
  try {
    const { name, description, link, course } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required!" });
      case !description:
        return res.status(500).send({ error: "description is required!" });
      case !link:
        return res.status(500).send({ error: "link is required!" });
      case !course:
        return res.status(500).send({ error: "course is required!" });
    }

    const video = await videoModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    await video.save();

    res.status(201).send({
      success: true,
      msg: "Video Details Updated Successfully!",
      video,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error In Video Link Update!", err });
  }
};

//* Video COUNT CONTROLLER || GET
export const videoCountController = async (req, res) => {
  try {
    const total = await videoModel.find({}).estimatedDocumentCount();

    res.status(200).send({
      success: true,
      msg: "Videos Counted",
      total,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error While Counting Videos!", err });
  }
};

//* SEARCH Video CONTROLLER || GET
export const searchVideoController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    };

    const escapedKeyword = escapeRegExp(keyword);

    const results = await videoModel.find({
      $or: [{ name: { $regex: escapedKeyword, $options: "i" } }],
    });

    res.json(results);
  } catch (err) {
    res.status(500).send({
      success: false,
      msg: "Error While Searching Videos!",
      err,
    });
  }
};
