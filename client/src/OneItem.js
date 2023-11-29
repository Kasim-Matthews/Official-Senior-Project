import React, { useEffect } from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

function ViewItem(){
    
    const navigate = useNavigate();
    const {id} = useParams();
    const [record, setRecord] = React.useState({})
    
          useEffect(() => {
            Axios.get(`http://localhost:3001/item/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setRecord(key)});
            })
          }, [])

          return(
            <table>
                <thead>
                    <th>
                        <tr>
                            <td>Name</td>
                            <td>Market Value</td>
                            <td>Package Size</td>
                        </tr>
                    </th>
                </thead>
                <tbody>
                <tr>
                    <td>{record.Name}</td>
                    <td>${record.marketValue}</td>
                    <td>{record.packageSize}</td>
                </tr>
                </tbody>
            </table>
          )
}

export default ViewItem;