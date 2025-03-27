const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Sample Post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: String,
  comments: [String],
});

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post('/posts', async (req, res) => {
  const { title, content, imageUrl } = req.body;
  const newPost = new Post({ title, content, imageUrl, comments: [] });
  await newPost.save();
  res.status(201).json(newPost);
});

app.post('/posts/:id/comments', async (req, res) => {
  const { comment } = req.body;
  const post = await Post.findById(req.params.id);
  post.comments.push(comment);
  await post.save();
  res.status(200).json(post);
});

// Server start
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
