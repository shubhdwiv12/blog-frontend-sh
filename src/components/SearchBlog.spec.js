import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // For better assertion support
import SearchBlog from './SearchBlog';
import * as api from '../services/api'; // Mock API calls
import { BrowserRouter as Router } from 'react-router-dom'; // To support routing
import { AuthProvider } from '../context/AuthContext';

import axios from 'axios';

// Mock axios

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
      }
    }))
  }
})
const mockedAxios = axios ;
// Define the mock implementations
mockedAxios.post = jest.fn();
mockedAxios.delete= jest.fn()
mockedAxios.interceptors= jest.fn()
jest.mock('../services/api');

// Define the mock implementations
mockedAxios.delete = jest.fn();
mockedAxios.get = jest.fn();

describe('SearchBlog Component', () => {
  beforeEach(async () => {
    // Mock fetchAllBlogs to return empty data initially
    api.fetchAllBlogs.mockResolvedValue({ data: [] });
    render(
      <AuthProvider>
     <Router>
        <SearchBlog />
      </Router>
      </AuthProvider>
 
    );
    // Wait for component to fully load
    await waitFor(() => screen.getByText('Blogs'));
  });

  it('should render the SearchBlog component', () => {
    expect(screen.getByText('Blogs')).toBeVisible();
    expect(screen.getByPlaceholderText('Filter by category')).toBeVisible();
    expect(screen.getByRole('button', { name: /Add Article/i })).toBeVisible();
  });

  it('should filter blogs by category', async () => {
    // Mock API response when filtering by category
    api.searchBlogsByCategory.mockResolvedValue({
      data: [{ _id: '1', blogName: 'Technology Blog Title', article: '...', category: 'Technology' }],
    });

    // Simulate user input to filter by category
    fireEvent.change(screen.getByPlaceholderText('Filter by category'), { target: { value: 'Technology' } });
    fireEvent.click(screen.getByRole('button', { name: /Filter/i }));

    // Wait for the blogs to be filtered
    await waitFor(() => expect(screen.getByText('Technology Blog Title')).toBeVisible());
  });

  it('should add a new blog', async () => {
    // Mock API response for adding a blog
    api.addBlog.mockResolvedValue({});

    // Simulate opening the Add Article modal
    fireEvent.click(screen.getByRole('button', { name: /Add Article/i }));

    // Fill in the modal form
    fireEvent.change(screen.getByPlaceholderText('Enter blog name'), { target: { value: 'New Blog' } });
    fireEvent.change(screen.getByPlaceholderText('Enter article'), { target: { value: 'This is a new blog article.' } });
    fireEvent.change(screen.getByPlaceholderText('Enter category'), { target: { value: 'Technology' } });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Add Blog/i }));

    // Wait for the blog to be added and appear in the list
    await waitFor(() => expect(api.addBlog).toHaveBeenCalled());
  });


  it('should log out the user', async () => {
    // Simulate clicking the logout button
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

    // Verify redirection to the login page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
