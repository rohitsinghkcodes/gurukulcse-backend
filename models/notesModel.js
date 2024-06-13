import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  pdfLink: {
    type: String,
    required: true,
  },
  zipLink: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

export default mongoose.model("notes", notesSchema);
