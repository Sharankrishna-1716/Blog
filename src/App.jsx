import React, { useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  // Handle creating a new blog post
  const handleAddPost = () => {
    if (newPost.trim()) {
      setPosts([
        ...posts,
        { id: Date.now(), content: newPost, comments: [] },
      ]);
      setNewPost("");
    }
  };

  // Handle deleting a post
  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  // Handle editing a post
  const handleEditPost = (id) => {
    const postToEdit = posts.find((post) => post.id === id);
    setEditingPost(postToEdit);
  };

  // Handle saving edited post
  const handleSaveEdit = () => {
    setPosts(
      posts.map((post) =>
        post.id === editingPost.id ? { ...post, content: editingPost.content } : post
      )
    );
    setEditingPost(null);
  };

  // Handle adding a comment to a post
  const handleAddComment = (postId) => {
    if (newComment.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
      setNewComment("");
    }
  };

  return (
    <div className="app-container">
      <div className="add-post">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write a new blog post"
        />
        <button onClick={handleAddPost}>Add Post</button>
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-content">
              {editingPost && editingPost.id === post.id ? (
                <>
                  <textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  />
                  <button className="save-btn" onClick={handleSaveEdit}>
                    Save Edit
                  </button>
                </>
              ) : (
                <>
                  <p>{post.content}</p>
                  <button className="edit-btn" onClick={() => handleEditPost(post.id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>

            <div className="comments-section">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
              />
              <button onClick={() => handleAddComment(post.id)}>Add Comment</button>
              <div className="comments">
                {post.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <p>{comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
