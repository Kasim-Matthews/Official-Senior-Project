import React, { useEffect } from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function Partner(){
    const navigate = useNavigate();

    const [partnerList, setPartnerList] = React.useState([])

    useEffect(() => {
        Axios.get("http:////localhost:3001/partner").then((response) =>{
            setPartnerList(response.data);
        })
    })

    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Comments</td>
                    </tr>
                </thead>
                <tbody>
                    {partnerList.map((val) => {
                        return(
                            <tr>
                                <td>{val.name}</td>
                                <td>{val.email}</td>
                                <td>{val.comments}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <p>Make sure when doing input validation you give an error if email is already and don't allow submit, can cause some weird errors</p>
        </div>
    );
}

export default Partner;