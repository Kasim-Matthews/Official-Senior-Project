import React, { useEffect } from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function Item(){
    const navigate = useNavigate();

    const [itemList, setItemList] = React.useState([])

    useEffect(() => {
        Axios.get("http:////localhost:3001/item").then((response) =>{
            setItemList(response.data);
        })
    })

    const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3001/item/remove/${id}`);
      }

    return(
        <div>
            <table>
                <thead>
                    <th>
                        <tr>
                            <td>Name</td>
                            <td>Market Value</td>
                            <td>Actions</td>
                        </tr>
                    </th>
                </thead>
                <tbody>
                    {itemList.map((val) => {
                        return(
                            <tr>
                                <td>{val.Name}</td>
                                <td>${val.marketValue}</td>
                                <td><button onClick={() => handleRemove(val.iditem)}>Delete</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Item;