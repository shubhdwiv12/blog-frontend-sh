import axios from 'axios';

// Base API URL pointing to localhost:5000
const API_URL = 'http://localhost:5000/api';

// Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add token to headers if available
// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

// API Requests

// Register user
export const registerUser = (userData) => {
  return axiosInstance.post('/users/register', userData);
};

// Login user
export const loginUser = (userData) => {
  return axiosInstance.post('/users/login', userData);
};

// Search blogs by category
export const searchBlogsByCategory = (category) => {
  return axiosInstance.get(`/blog-query/info/${category}`);
};
// Search blogs by category
export const fetchAllBlogs = () => {
    return axiosInstance.get(`/blog-query/Allblogs`);
  };
// Search blogs by category
export const deleteBlog = (name) => {
    return axiosInstance.delete(`/blogs/delete/${name}`);
  };

  export const addBlog = (blogData) => {
    return axiosInstance.post('/blogs/add', blogData); // POST request to add blog
  };
