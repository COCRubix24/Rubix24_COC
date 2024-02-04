import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
      default: false,
    },
    premiumExpiration: {
      type: Date,
    },
    departments: {
      type: [String],
    },
  },
  { timestamps: true },
);

CompanySchema.pre("find", () => {
  if (this.isPremium) {
    let currentDate = new Date().toISOString();
    if (currentDate > this.premiumExpiration) {
      this.isPremium = false;
    }
  }
});

export default mongoose.model("Company", CompanySchema);
