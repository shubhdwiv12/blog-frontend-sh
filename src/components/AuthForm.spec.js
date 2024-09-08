import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext'; // Import the AuthProvider
import axiosInstance from '../services/api'; // Import your axios instance
import AuthForm from './AuthForm'; // Import the AuthForm component
import { BrowserRouter as Router } from 'react-router-dom';
jest.mock('../services/api'); // Mock axios
import axios from 'axios';

describe('AuthForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  // Wrap AuthForm with AuthProvider
  const renderWithAuthProvider = (component) => {
    return render(<AuthProvider><Router>{component}</Router></AuthProvider>);
  };

  it('should render the AuthForm component', () => {
    renderWithAuthProvider(<AuthForm />);

    // Use more specific queries
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should log in the user', async () => {
    // Mock API login response if needed

    renderWithAuthProvider(<AuthForm />);

    // Simulate user input and submission
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Verify redirection or login success
    // This may require mocking or verifying state changes
  });


});
