import React, { useState, useEffect, useContext } from 'react';
import { searchBlogsByCategory, deleteBlog, fetchAllBlogs, addBlog } from '../services/api';
import AuthContext from '../context/AuthContext'; // Import AuthContext for logout functionality
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap components

const SearchBlog = () => {
  const [category, setCategory] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false); // For controlling the modal
  const [newBlog, setNewBlog] = useState({
    blogName: '',
    article: '',
    category: ''
  });
  
  const { logout } = useContext(AuthContext); // Get logout function from AuthContext
  const navigate = useNavigate();

  // Fetch all blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const response = category ? await searchBlogsByCategory(category) : await fetchAllBlogs(); // Fetch all blogs initially
      setBlogs(response.data);
      setFilteredBlogs(response.data);
    } catch (err) {
      console.error('Error fetching blogs');
    }
  };

  // Handle filtering blogs by category
  const handleFilter = async () => {
    try {
      const response = await searchBlogsByCategory(category);
      setFilteredBlogs(response.data);
    } catch (err) {
      console.error('Error filtering blogs');
    }
  };

  // Handle deleting a blog
  const handleDelete = async (blogId) => {
    try {
      await deleteBlog(blogId);
      fetchBlogs(); // Refresh blogs after deletion
    } catch (err) {
      console.error('Error deleting blog');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Remove token from AuthContext
    navigate('/'); // Navigate to login page
  };

  // Handle modal open/close
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Handle adding a new blog
  const handleAddBlog = async () => {
    try {
      await addBlog(newBlog); // API call to add blog
      fetchBlogs(); // Refresh blogs after adding
      handleCloseModal(); // Close modal after adding
    } catch (err) {
      console.error('Error adding blog');
    }
  };

  // Handle input change for new blog
  const handleInputChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Blogs</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleFilter}>
          Filter
        </button>
        <button className="btn btn-success mt-2 ms-2" onClick={handleShowModal}>
          Add Article
        </button>
      </div>

      {filteredBlogs.length > 0 ? (
        <div className="row">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">{blog.blogName}</h5>
                  <p className="card-text">{blog.article.slice(0, 100)}...</p>
                  <p className="text-muted"><strong>Category:</strong> {blog.category}</p>
                  <button className="btn btn-danger" onClick={() => handleDelete(blog.postgres_id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No blogs found.</p>
      )}

      {/* Add Article Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Blog Name</Form.Label>
              <Form.Control
                type="text"
                name="blogName"
                placeholder="Enter blog name"
                value={newBlog.blogName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Article</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="article"
                placeholder="Enter article"
                value={newBlog.article}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                placeholder="Enter category"
                value={newBlog.category}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddBlog}>
            Add Blog
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SearchBlog;
