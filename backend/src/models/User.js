import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: /^[A-Z0-9][A-Z0-9._%+-]{0,62}@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer", required: true },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model("User", userSchema);
