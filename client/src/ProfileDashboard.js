import React from "react";
import { useRef, useState, useEffect } from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "./hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import Navbar from "./components/navbar";
import Button from '@mui/material/Button';


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const ProfileDashboard = () => {

    const userRef = useRef();
    const errRef = useRef();

    const [success, setSuccess] = useState(false);
    const [usuccess, setUSuccess] = useState(false);

    const [userName, setUserName] = useState();
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [email, setEmail] = useState();
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);


    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController();

        const getUser = async () => {
            try {
                const response = await axiosPrivate.get(`http://localhost:3001/user/${auth.id}`)
                isMounted && setUserName(response.data[0].Username) && setEmail(response.data[0].Email)
            }
            catch (err) {
                console.error(err)

            }
        }
        getUser()

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])




    const bringback = () => {
        setSuccess(false)
    }

    const bringback2 = () => {
        setUSuccess(false)
    }

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(userName));
    }, [userName])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [userName, pwd, matchPwd])

    const handle_userName_and_email = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(userName);
        const v3 = EMAIL_REGEX.test(email)
        if (!v1 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }


        try {
            const response = await axiosPrivate.post(`http://localhost:3001/user/${auth.id}/ue`, {
                userName: userName,
                email: email
            }
            );
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUserName('');
            setEmail('')
            setUSuccess(true)
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Changes have Failed')
                console.log(err)
            }
            errRef.current.focus();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v2 = PWD_REGEX.test(pwd);
        if (!v2) {
            setErrMsg("Invalid Entry");
            return;
        }


        try {
            const response = await axiosPrivate.post(`http://localhost:3001/user/${auth.id}/cp`, {
                pwd: pwd,
            }
            );

            //clear state and controlled inputs
            //need value attrib on inputs for this
            setPwd('');
            setMatchPwd('');
            setSuccess(true)
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('User not found');
            } else if (err.response?.status === 406) {
                setErrMsg('Password is in use');
            } else {
                setErrMsg('Registration Failed')
                console.log(err)
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <Navbar />

            {usuccess ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <Button variant="outlined" onClick={bringback2}>Change username/email again</Button>
                    </p>
                </section>
            ) : (<section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Change Username and Email</h1>
                <form onSubmit={handle_userName_and_email}>

                    <label htmlFor="email">
                        Email:
                    </label>
                    <input
                        type="text"
                        id="email"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        defaultValue={email}
                        required
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                    />
                    <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must be a valid email address.<br />
                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>

                    <label htmlFor="username">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUserName(e.target.value)}
                        defaultValue={userName}
                        required
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                    />
                    <p id="uidnote" className={userFocus && userName && !validName ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters.<br />
                        Must begin with a letter.<br />
                        Letters, numbers, underscores, hyphens allowed.
                    </p>



                    <button disabled={!validName || !validEmail ? true : false}>Save</button>
                </form>
            </section>)}


            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <Button variant="outlined" onClick={bringback}>Change password again</Button>
                    </p>
                </section>
            ) : (<section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Change Password</h1>
                <form onSubmit={handleSubmit}>

                    <label htmlFor="password">
                        New Password:

                    </label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>


                    <label htmlFor="confirm_pwd">
                        Confirm Password:

                    </label>
                    <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    />
                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>


                    <button disabled={!validPwd || !validMatch ? true : false}>Change Password</button>
                </form>
            </section>)}

        </>
    )

}

export default ProfileDashboard;