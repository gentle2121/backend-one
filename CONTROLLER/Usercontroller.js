const bcrypt = require("bcryptjs");
const User = require("../models/Usermodels");
const Usermodels = require("../models/Usermodels");
// const Usermodels = require("../models/Usermodels");

// Create new user
const NewUser = async (req, res) => {
  try {
    let { firstName, lastName, phoneNumber, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ firstName, lastName, phoneNumber, email, password, confirmPassword });
    const savedUser = await newUser.save();

    res.status(201).json({
      _id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      phoneNumber: savedUser.phoneNumber,
      email: savedUser.email
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Login user
const LoginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
const GetAllUser = async (req, res) => {
  try {
    const users = await Usermodels.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get single user
const GetSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get single user error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update single user
const UpdateSingleUser = async (req, res) => {
  const { id } = req.params;
  let { firstName, lastName, phoneNumber, email, password, confirmPassword } = req.body;

  try {
    const user = await User.findById(id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email.trim().toLowerCase();

    // Only update password if both fields are provided
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      user.password = password;
      user.confirmPassword = confirmPassword;
    }

    const updatedUser = await user.save();
    res.status(200).json({ message: "User updated successfully", user: updatedUser });

  } catch (error) {
    console.error("Update user error:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Delete single user
const DeleteSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  NewUser,
  LoginUser,
  GetAllUser,
  GetSingleUser,
  UpdateSingleUser,
  DeleteSingleUser
};
