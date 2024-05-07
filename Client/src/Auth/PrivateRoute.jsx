import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import Dashboard from '../core/Dashboard';
import Manager from '../core/Manager';
import { ROLES } from '../config/role';

const PrivateRoute = ({ element, allowedRoles }) => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    if (!userInfo) {
        // If userInfo is not available, redirect to login page
        return <Navigate to="/login" />;
    }

    const decoded = jwtDecode(userInfo.accessToken);

    if (allowedRoles.includes(ROLES.WRITER) && decoded.UserInfo.roles.includes("writer")) {
        return element;
    } else if (allowedRoles.includes(ROLES.MANAGER) && decoded.UserInfo.roles.includes("manager")) {
        return element;
    } else {
        // If user doesn't have any valid role, redirect to login page
        return <Navigate to="/login" />;
    }
}

export default PrivateRoute;
