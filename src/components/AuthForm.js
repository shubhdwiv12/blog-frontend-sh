import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import { loginUser, registerUser } from '../services/api';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // Use AuthContext for managing token
  const navigate = useNavigate(); // Use useNavigate for redirection
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Assuming login API is /api/v1.0/blogsite/user/login
        const response = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        const token = response.data.token;
        login(token); // Save the token
        alert('Logged in successfully!');
        navigate('/search'); // Navigate to search page after login
      } else {
        // Assuming register API is /api/v1.0/blogsite/user/register
        await registerUser(formData);
        alert('Registered successfully! You can now log in.');
        setIsLogin(true); // Switch to login after successful registration
      }
    } catch (err) {
      setError('Error: Please check your details and try again.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
            {!isLogin && (
              <div className="form-group mb-3">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-danger">{error}</p>}

            <button type="submit" className="btn btn-primary w-100 mb-3">
              {isLogin ? 'Login' : 'Register'}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-link"
                onClick={toggleForm}
              >
                {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
