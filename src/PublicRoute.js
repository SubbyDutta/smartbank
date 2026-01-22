import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded.role === 'ADMIN') {
                return <Navigate to="/admin" />;
            }
            return <Navigate to="/user" />;
        } catch (error) {
            localStorage.removeItem('token');
        }
    }

    return children;
};

export default PublicRoute;
