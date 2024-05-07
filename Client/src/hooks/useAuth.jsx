import { useSelector } from "react-redux";
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!userInfo || typeof userInfo.accessToken !== 'string') {
    // Return default state indicating user is not authenticated
    return {
      username: "",
      roles: [],
           status: "inactive"
    };
  }



  try {
    const decoded = jwtDecode(userInfo.accessToken);
    const { username, roles } = decoded.UserInfo;

  

    return {
      username,
      roles,
     
      status
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    // Return default state indicating user is not authenticated
    return {
      username: "",
      roles: [],
     
      status: "inactive"
    };
  }
};

export default useAuth;
