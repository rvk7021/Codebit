/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../components/Redux/Slices/AuthSlice';

export default function SigninCard() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Field updated:", name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart()); // Start loading state
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        dispatch(signInFailure(data.message)); // Store error in Redux
        return;
      }

      dispatch(signInSuccess(data.user)); // Save user data in Redux
      setError(null);
      console.log("Response from backend:", data);

      // Navigate to dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      dispatch(signInFailure(error.message)); // Store error in Redux
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-gradient-to-b from-white to-gray-100 rounded-3xl p-8 border border-white shadow-lg">
      <h1 className="text-center font-extrabold text-3xl text-blue-600 mb-6">Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input required type="email" id="email" name="email" value={formData.email} placeholder="E-mail" onChange={handleChange} className="w-full bg-white py-3 px-4 rounded-xl shadow-md mb-4 focus:outline-none focus:border-blue-500" />
        <input required type="password" id="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} className="w-full bg-white py-3 px-4 rounded-xl shadow-md mb-4 focus:outline-none focus:border-blue-500" />
        <button type="submit" className="w-full font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-xl shadow-lg transition-transform hover:scale-105">
          Sign In
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <p className="text-center mt-4">
        Don't have an account?{' '}
        <Link to="/sign-up" className="text-blue-600 underline">
          Sign Up Here
        </Link>
      </p>
    </div>
  );
}
