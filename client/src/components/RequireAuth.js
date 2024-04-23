import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from 'jwt-decode';

const RequireAuth = ({ children }) => {
    const { auth } = useAuth();
    const location = useLocation();

    const isValidToken = (token) => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // current time in seconds
            return decoded.exp > currentTime;
        } catch (error) {
            console.error("Token decoding failed:", error);
            return false;
        }
    };

    return (
        
        //auth?.accessToken && isValidToken(auth.accessToken)
        !auth?.accessToken || !isValidToken(auth.accessToken)
            ? <Navigate to="/login" state={{ from: location }} replace />
            : <Outlet />
    );
}

export default RequireAuth;