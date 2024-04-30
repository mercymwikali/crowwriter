// import { useLocation, Navigate, Outlet } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';

// const PrivateRoute = ({ allowedRoles }) => {
//   const {roles}=useAuth();
//   const location =useLocation();

//   return(
//     roles?.find(role => allowedRoles?.includes(role)) ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
//   )
// };

// export default PrivateRoute;
