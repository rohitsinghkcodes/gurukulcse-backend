import slugify from "slugify";
import fs from "fs";
import paperModel from "../models/paperModel.js";

//* ADD NEW RESEARCH PAPER CONTROLLER || POST
export const addPaperController = async (req, res) => {
  try {
    const { name, description, pdfLink } = req.fields;
    // const { pdf } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required!" });
      case !description:
        return res.status(500).send({ error: "description is required!" });
      case !pdfLink:
        return res.status(500).send({ error: "pdf link is required " });
    }

    const existingPaper = await paperModel.findOne({ name });

    if (existingPaper) {
      return res.status(400).send({
        msg: "this research paper already exists!",
      });
    }

    const paper = await new paperModel({
      ...req.fields,
      slug: slugify(name),
      updatedAt: new Date(),
    }).save();
    // if (pdf) {
    //   paper.pdf.data = fs.readFileSync(pdf.path);
    //   paper.pdf.contentType = pdf.type;
    // }
    // await paper.save();

    res.status(201).send({
      success: true,
      msg: "New Research Paper Added.",
      paper,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error in paper Creation!", err });
  }
};

//* UPDATE paper CONTROLLER
export const updatePaperController = async (req, res) => {
  try {
    const { name, description, pdfLink } = req.fields;
    // const { pdf } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required!" });
      case !description:
        return res.status(500).send({ error: "description is required!" });
      case pdfLink:
        return res.status(500).send({ error: "pdf link is required " });
    }

    const { id } = req.params;
    const paper = await paperModel.findByIdAndUpdate(
      id,
      { ...req.fields, slug: slugify(name), updatedAt: new Date() },
      { new: true }
    );
    await paper.save();

    res.status(201).send({
      success: true,
      msg: "paper Updated Successfully",
      paper,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while updating paper!", err });
  }
};

//* GET ALL papers CONTROLLER
export const paperController = async (req, res) => {
  try {
    const papers = await paperModel.find({});

    res.status(200).send({
      success: true,
      msg: "papers Fetched Successfully!",
      papers,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while fetching papers!", err });
  }
};

//* GET SINGLE paper CONTROLLER
export const getSinglePaperController = async (req, res) => {
  try {
    const paper = await paperModel.findOne({ slug: req.params.slug });
    if (paper) {
      res.status(200).send({
        success: true,
        msg: "paper Fetched Successfully!",
        paper,
      });
    } else {
      res.status(400).send({ success: false, msg: "paper not available", err });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while fetching paper!", err });
  }
};

// //* paper pdf CONTROLLER || GET
// export const paperpdfController = async (req, res) => {
//   try {
//     const paper = await paperModel.findById(req.params.id).select("pdf");

//     if (paper.pdf.data) {
//       res.set("Contect-type", paper.pdf.contentType);
//       return res.status(200).send(paper.pdf.data);
//     }
//   } catch (err) {
//     console.log(err);
//     res
//       .status(500)
//       .send({ success: false, msg: "Error While Fetching paper pdf!", err });
//   }
// };

//! DELETE paper CONTROLLER
export const deletePaperController = async (req, res) => {
  try {
    const { id } = req.params;
    const paper = await paperModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      msg: "paper Deleted Successfully!",
      paper,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, msg: "Error while deleting paper!", err });
  }
};
