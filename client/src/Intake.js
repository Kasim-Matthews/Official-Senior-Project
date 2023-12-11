import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, Link} from "react-router-dom";

function Intake(){
    const navigate = useNavigate();

    const [intakeList, setIntakeList] = React.useState([])

    useEffect(() => {
        Axios.get("http:////localhost:3001/intake").then((response) =>{
            setIntakeList(response.data);
        })
    }, [])




    /*const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3001/partner/remove/${id}`);
    }

    const handleEdit = (id) => {
        navigate(`/partner/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/partner/${id}`)
      }*/



    return(
        <div>
            <button><Link to="/intake/new">Add</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>Partner</th>
                        <th>Value</th>
                        <th>Recieved Date</th>
                        <th>Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {intakeList.map((val) => {
                        let q = new Date(val.RecievedDate);
                        let monthRecievedDate= ""
                        let dayRecievedDate = ""
                        let yearRecievedDate = ""
                        let concatRecievedDate = ""
                        monthRecievedDate = q.getMonth()+ 1
                        dayRecievedDate = q.getDate() + 1
                        yearRecievedDate = q.getFullYear()+1
                        concatRecievedDate = yearRecievedDate + "-" + monthRecievedDate + "-" + dayRecievedDate
                        return(
                            
                            <tr>
                                <td>{val.Name}</td>
                                <td>{val.Value}</td>
                                <td>{concatRecievedDate}</td>
                                <td>{val.Comments}</td>
                                <td>
                                    <button /*onClick={() => handleRemove(val.Partner_id)}*/>Delete</button>
                                    <button /*onClick={() => handleEdit(val.Partner_id)}*/>Edit</button>
                                    <button /*onClick={() => handleView(val.Partner_id)}*/>View</button>
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default Intake;