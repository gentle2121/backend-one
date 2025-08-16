const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // never return by default
    },

    confirmPassword: {
      type: String,
      required: false,
      select: false
    }
  },
  { timestamps: true }
);

// Hash password before save (for create and update)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password !== this.confirmPassword) {
    return next(new Error("Passwords do not match"));
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

module.exports = mongoose.model("User", UserSchema);
