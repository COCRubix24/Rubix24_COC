import mongoose from "mongoose";

const LawyerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    yearOfExperience: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    idCard: {
      type: String,
      required: true,
    },
    profileImagePublicId: {
      type: String,
      required: true,
    },
    idCardPublicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Lawyer", LawyerSchema);
