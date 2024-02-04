import mongoose from "mongoose";

const ComplainSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: [true, "Please provide company"],
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    pinataIPFS: {
      type: String,
    },
    preferedLanguage: {
      type: String,
      // enum: ["English", "Spanish"],
      required: true,
    },
    preferedContactMethod: {
      type: String,
      enum: ["web", "phone", "chat"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Submitted complain", "In progress", "resolved", "rejected"],
      default: "Submitted complain",
      required: true,
    },
    description: {
      type: String,
    },
    department: {
      type: String,
    },
    keywords: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Complain", ComplainSchema);
