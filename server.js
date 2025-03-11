const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Ensure `uploads` folder exists
const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// File where we store posts
const POSTS_FILE = "posts.json";

// Load existing posts
let posts = [];
if (fs.existsSync(POSTS_FILE)) {
    try {
        const data = fs.readFileSync(POSTS_FILE);
        posts = JSON.parse(data);
    } catch (error) {
        console.error("Error reading posts.json:", error);
        posts = [];
    }
}

// Multer Storage
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// Route to upload a post
app.post("/api/upload", upload.single("image"), (req, res) => {
    console.log("Upload request received");

    if (!req.file) {
        return res.status(400).json({ message: "Image upload failed. Please try again." });
    }

    const { title, description } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;

    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
    }

    const newPost = { title, description, image: imagePath };
    posts.push(newPost);

    try {
        fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
        console.log("Post saved successfully:", newPost);
        res.json({ message: "Post uploaded successfully!" });
    } catch (error) {
        console.error("Error writing to posts.json:", error);
        res.status(500).json({ message: "Failed to save post." });
    }
});

// Route to fetch posts
app.get("/api/posts", (req, res) => {
    res.json(posts);
});

// Route to delete a post
app.delete("/api/delete/:title", (req, res) => {
    const title = req.params.title;
    const postIndex = posts.findIndex(post => post.title === title);

    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Delete the image file
    const imagePath = path.join(__dirname, posts[postIndex].image);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }

    // Remove post from the array
    posts.splice(postIndex, 1);

    // Save updated posts to JSON file
    try {
        fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
        console.log(`Post "${title}" deleted successfully`);
        res.json({ message: "Post deleted successfully!" });
    } catch (error) {
        console.error("Error writing to posts.json:", error);
        res.status(500).json({ message: "Failed to delete post." });
    }
});

// Start server
const PORT = 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
