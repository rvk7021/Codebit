import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from './Redux/Slices/AuthSlice';
const Navbar = () => {
 const {token}=useSelector(state=>state.auth);
//  const {user}=useSelector(state=>state.profile); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
   dispatch(signOut());
    navigate('/sign-in');
  };
 
  

  return (
    <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">CodeBit</Link>
      <ul className="flex space-x-6">
      <Link to="/" className="hover:text-gray-300 cursor-pointer">Home </Link>
        <Link to="/editor" className="hover:text-gray-300 cursor-pointer">Practice </Link>
        <Link to="/contest" className="hover:text-gray-300 cursor-pointer">Contests</Link>
        {token!=null ? (
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
