import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/posts')
      .then(response => setPosts(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <Header />
      <main>
        <section className="blog-info">
          <h2>Welcome to the Blogging Platform!</h2>
          <p>This platform allows you to create, read, like, comment, and share blog posts. Whether you're a casual blogger, a professional writer, or just someone who loves to share their thoughts, this platform is for you.</p>
        </section>

        <section className="post-feed">
          <h2>Latest Blog Posts</h2>
          <div className="post-cards">
            {posts.map(post => (
              <div key={post._id} className="post-card">
                <img src={post.imageUrl} alt="Post" />
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 100)}...</p>
                <Link to={`/post/${post._id}`} className="read-more">Read More</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
