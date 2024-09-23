
import React, { useEffect } from "react";
import Navbar from "./components/navbar";

function ErrorHandler() {
    return (
        <div style={{position: "absolute", top: "40%", left: "40%", textAlign: "center"}}>
            <h3>Oopss....</h3>
            <h4>Seems and error occured while fethcing your data</h4>
            <p>Try refreshing the page or contact the developers</p>
        </div>
    )
}

export default ErrorHandler