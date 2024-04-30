// import { useSelector } from "react-redux";
// import { selectCurrentToken } from "../Auth/authSlice";
// import {jwtDecode} from 'jwt-decode'; // Corrected import statement

// const useAuth = () => {
//   const token = useSelector(selectCurrentToken);
//   let isManager = false;
//   let isAdmin = false;
//   let status = "writer";

//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       const { username, roles } = decoded.UserInfo; // Changed from `roles` to `role`

//       isManager = roles.includes("manager");
//       isAdmin = roles.includes("admin");

//       if (isManager) status = "manager";
//       else if (isAdmin) status = "admin";

//       return {
//         username,
//         roles, // Corrected the key to `role`
//         isManager,
//         isAdmin,
//         status
//       }
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       // Handle token decoding error
      
//     }
//   }

//   return {
//     username: " ",
//     roles: [], // Ensure that role is initialized as an array
//     isManager,
//     isAdmin,
//     status
//   };
// };

// export default useAuth;
