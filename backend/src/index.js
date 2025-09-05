import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./Model/model.user.js";
import blogRouter from "./router/router.blogRouter.js";
import Blog from "./Model/model.blog.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI

console.log(MONGO_URI);
const JWT_SECRET = process.env.JWT_SECRET 

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI).then(()=>{
  console.log("Connected to MongoDB");
}).catch((err)=>{
  console.error("Error connecting to MongoDB:", err);
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// router for blogs
app.use("/api/blogs", blogRouter);

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password} = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ accessToken: token, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/auth/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/auth", async (req, res) => {
    // get all the users
    try {
        const users = await User.find()
        res.json({message: "Users fetched successfully", users});

        
    } catch (error) {
        if(error instanceof Error){
            console.log(error.message);
            res.status(500).json({message: error.message});
        }
    }
});

app.put("/api/auth/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "Account updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/auth/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // post
    await Blog.deleteMany({ userId: req.params.id });

    // Delete user
    await user.deleteOne();

    res.json({ message: "Account and posts deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});