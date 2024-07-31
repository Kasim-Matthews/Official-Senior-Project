import { useRef, useState, useEffect } from 'react';
import useAuth from './hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import './login.css';
import Axios from 'axios';

const Login = () => {

    const { setAuth, persist, setPersist } = useAuth();

    Axios.defaults.withCredentials = true



    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/Dashboard"

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios.post('http://localhost:3001/auth/login', JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3001, http://localhost:3000' },
                }
            );


            console.log(JSON.stringify(response?.data));

            const accessToken = response?.data?.accessToken;
            const role = response?.data?.role;
            const id = response?.data?.id;



            setAuth({ user, pwd, role, accessToken, id });
            setUser('');
            setPwd('');

            navigate(from, { replace: true });
        } catch (err) {
            console.log(err)
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const togglePersist = () => {
        setPersist(prev => !prev)
    }

    useEffect(() => {
        localStorage.setItem("persist", persist)
    }, [persist])

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
                <div>
                    <input
                        type='checkbox'
                        id='persist'
                        onChange={togglePersist}
                        checked={persist}
                    />
                    <label htmlFor='persist'>Trust this Device</label>
                </div>
            </form>
        </section>
    )
}

export default Login