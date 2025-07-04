import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/useAuthStore';

const RoleRoute = ({ allowedRoles, children }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  if (!token || !user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;

  return children;
};

export default RoleRoute;
