import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { IoNotificationsCircleOutline } from "react-icons/io5";

const NotificationBtn = () => {
    const user = useAuth();
    const navigate = useNavigate();

    const handleNotification = () => {
        if (user.UserInfo.role === "writer") {
            console.log("writer navigate");
            navigate("/dashboard/notifications");
        }
    }

    return (
        <div onClick={handleNotification}>
            <IoNotificationsCircleOutline
                className='my-3'
                style={{ marginRight: '10px', color: '#fff', fontSize: '34px', cursor: 'pointer' }}
            />
        </div>
    );
}

export default NotificationBtn;
