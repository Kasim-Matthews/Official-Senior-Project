import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({});

 const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const navigate = useNavigate();
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    // const login = (token) => setAuth({ token });
    // const logout = () => setAuth(null);

    // useEffect(() => {
    //     const verifySession = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:3001/refresh/verifySession', { withCredentials: true });
    //             setAuth({ accessToken: response.data.accessToken });
    //             //localStorage.setItem("auth", response.data.accessToken)
    //             console.log("Local Storage: ", localStorage.getItem("auth"))
    //             //console.log(response.data.accessToken)
                
    //         } catch (error) {
    //             console.error("Session verification failed:", error);
    //             setAuth({});
    //             navigate('/login'); // Redirect to login on failure
    //         }
    //     };

    //     verifySession();
    // }, [navigate]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
