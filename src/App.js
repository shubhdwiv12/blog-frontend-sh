import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import SearchBlog from './components/SearchBlog';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <div>
        <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/search" element={<SearchBlog />} />
        </Routes>
      </Router>
    </AuthProvider>
    </div>

  );
};

export default App;
