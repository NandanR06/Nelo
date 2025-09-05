import express from "express";
import Blog from "../Model/model.blog.js"

const router = express.Router();

// Create a new blog
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    // Convert to IST
    const istDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const newBlog = new Blog({
      title,
      content,
      author,
      timestamp: istDate,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ _id: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update blog
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Only allow author to edit
    if (blog.author !== author) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    blog.title = title;
    blog.content = content;
    await blog.save();

    res.json({ message: "Blog updated", blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete blog
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { author } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author !== author) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
