import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.ObjectId,
      ref: "course",
      required: true,
    },

    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("videos", videoSchema);
