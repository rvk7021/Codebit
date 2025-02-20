import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.auth);
  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
