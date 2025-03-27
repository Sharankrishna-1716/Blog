import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </Router>
  );
}

function Header() {
  return (
    <header>
      <h1>SHARAXBLOG</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/create-post">Create Post</Link>
        <Link to="/about">About</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <p>&copy; 2025 Blogging Platform</p>
    </footer>
  );
}

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <img src={post.imageUrl} alt="Post" />
                <h3>{post.title}</h3>
                <p>{(post.content || "").substring(0, 100)}...</p>
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

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const navigate = useNavigate();

  // Handle image selection
  const handleImageChange = (e) => {
    setPostImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to send post data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (postImage) {
      formData.append('image', postImage);
    }

    // Debugging FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const result = await response.json();
      console.log('Post created successfully:', result);
      navigate('/'); // Redirect after successful post creation
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <Header/>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your post here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
function Profile() {
  const [user, setUser] = useState({
    username: 'JohnDoe',
    email: 'john@example.com',
    bio: 'Welcome to my blog!',
    profileImage: '/default-profile.png',
  });

  const [newUsername, setNewUsername] = useState(user.username);
  const [newBio, setNewBio] = useState(user.bio);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Handle Image Selection
  const handleImageChange = (e) => {
    setNewProfileImage(e.target.files[0]);
  };

  // Handle Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('username', newUsername);
    formData.append('bio', newBio);
    if (newProfileImage) {
      formData.append('profileImage', newProfileImage);
    }

    try {
      // Simulating API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      const updatedUser = {
        ...user,
        username: newUsername,
        bio: newBio,
        profileImage: newProfileImage
          ? URL.createObjectURL(newProfileImage)
          : user.profileImage,
      };
      setUser(updatedUser);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
    <Header/>
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={user.profileImage}
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-info">
          <h2>@{user.username}</h2>
          <p>{user.bio}</p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="edit-profile">
        <h3>Edit Profile</h3>
        <form onSubmit={handleProfileUpdate}>
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
          <textarea
            placeholder="Add a bio"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button type="submit" disabled={updating}>
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
function About() {
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/about');
        if (!response.ok) throw new Error('Failed to fetch about data');
        const data = await response.json();
        
        // Add the Sharax Blog information to the description
        const updatedData = {
          ...data,
          description: `${data.description}\n\nSharax Blog is a dynamic online platform that caters to a diverse audience, offering a blend of engaging content, insightful ideas, and expert opinions across various niches. Whether you’re a tech enthusiast, a lifestyle aficionado, or someone passionate about personal development, Sharax Blog has something to offer. Known for its sleek and user-friendly design, the platform ensures that readers can easily navigate through different categories, immersing themselves in a world of knowledge and inspiration.`,
        };

        setAboutContent(updatedData);
        setLoading(false);
      } catch (error) {
        setError('Sharax Blog: Your Ultimate Destination for Creativity and Inspiration  Sharax Blog is a dynamic online platform that caters to a diverse audience, offering a blend of engaging content, insightful ideas, and expert opinions across various niches. Whether youre a tech enthusiast, a lifestyle aficionado, or someone passionate about personal development, Sharax Blog has something to offer. Known for its sleek and user-friendly design, the platform ensures that readers can easily navigate through different categories, immersing themselves in a world of knowledge and inspiration.  One of the standout features of Sharax Blog is its commitment to delivering high-quality, well-researched, and up-to-date content. Each post is crafted with precision, offering readers valuable insights and practical tips that they can apply in their daily lives. From the latest tech trends and gadget reviews to health tips and self-improvement strategies, the blog covers a broad spectrum of topics that resonate with a global audience.  Sharax Blog also serves as a platform for aspiring writers and industry experts to share their perspectives and engage with a community of like-minded individuals. Readers can leave comments, share opinions, and foster meaningful conversations that add depth to the discussions. The blog frequently features guest contributors who bring fresh ideas and unique viewpoints, ensuring a continuous stream of innovative content.  Furthermore, Sharax Blog is visually captivating, with an Instagram-inspired layout that highlights the latest posts in a sleek grid format. Advanced animations enhance the browsing experience, making it both visually appealing and interactive. The profile section features a polished, minimalistic design, adding a touch of sophistication to the platform.  Whether youre looking for inspiration, information, or a fresh perspective, Sharax Blog is the go-to destination that blends style with substance, offering content that enlightens and empowers its readers');
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <Header />
      <main>
        <h2>About This Platform</h2>
        {error ? (
          <p>{error}</p>
        ) : (
          <div>
            <h3>{aboutContent?.title}</h3>
            <p>{aboutContent?.description}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to send message');
        return;
      }

      const data = await response.json();
      setSuccessMessage(data.message || 'Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setErrorMessage('An error occurred while sending the message.');
      console.error('Contact form error:', error);
    }
  };

  return (
    <div>
      <Header />
      <main>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>

        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </main>
      <Footer />
    </div>
  );
}


function PostDetails() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Header />
      <main>
        <h2>{post.title}</h2>
        <img src={post.imageUrl} alt={post.title} />
        <p>{post.content}</p>
      </main>
      <Footer />
    </div>
  );
}
function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Sign up failed');
        return;
      }

      navigate('/login');
    } catch (error) {
      setError('An error occurred during sign up.');
    }
  };

  return (
    <div>
      <Header />
      <main>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {error && <p className="error">{error}</p>}
      </main>
      <Footer />
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  return (
    <div>
      <Header />
      <main>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </main>
      <Footer />
    </div>
  );
}


export default App;
