import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await axios.get('http://localhost:3001/refresh/verifySession', { withCredentials: true });
                setAuth({ accessToken: response.data.accessToken });
            } catch (error) {
                console.error("Session verification failed:", error);
                setAuth({});
                navigate('/login'); // Redirect to login on failure
            }
        };

        verifySession();
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
