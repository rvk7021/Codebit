import './App.css';
import React from 'react';
import SignupCard from './pages/SignupCard';
import SigninCard from './pages/SigninCard';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CodeRunner from './pages/Editor';
import ProblemPractice from './pages/ProblemPractice';
import Layout from './components/Layout';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function App() {
 
  return (
    
      <Routes>
        {/* Wrap all pages inside Layout (so Navbar is always there) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="editor" element={<CodeRunner />} />
          <Route path="problem-practice/:title" element={<ProblemPractice />} />
        </Route>

        {/* Signup and Signin should NOT have the Navbar */}
        <Route path="/sign-in" element={<SigninCard />} />
        <Route path="/sign-up" element={<SignupCard />} />
      </Routes>
 
  );
}

export default App;
