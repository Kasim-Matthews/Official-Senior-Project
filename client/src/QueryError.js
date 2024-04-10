import React, { useEffect } from "react";

function QueryError() {
    return (
        <div style={{position: "absolute", top: "40%", left: "40%", textAlign: "center"}}>
            <h3>Oopss....</h3>
            <h4>Seems and error occured in your database</h4>
            <p>Contact the developers immediately</p>
        </div>
    )
}

export default QueryError