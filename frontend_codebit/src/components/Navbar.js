import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signoutUserSuccess } from '../components/Redux/Slices/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // Remove from localStorage
    dispatch(signoutUserSuccess());  
    navigate('/sign-in');
  };

  return (
    <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <h2 className="text-xl font-bold">CodeBit</h2>
      <ul className="flex space-x-6">
        <li className="hover:text-gray-300 cursor-pointer">Home</li>
        <li className="hover:text-gray-300 cursor-pointer">Practice Problems</li>
        <li className="hover:text-gray-300 cursor-pointer">Contests</li>
        {currentUser ? (
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link to="/sign-in" className="hover:text-gray-300 cursor-pointer">Login</Link>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
