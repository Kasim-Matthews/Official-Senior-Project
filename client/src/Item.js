import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, Link} from "react-router-dom";

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

    const handleEdit = (id) => {
        navigate(`/item/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/item/${id}`)
      }

    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>FairMarketValue</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {itemList.map((val) => {
                        return(
                            <tr>
                                <td>{val.Name}</td>
                                <td>${val.FairMarketValue}</td>
                                <td>
                                    <button onClick={() => handleRemove(val.Item_id)}>Delete</button>
                                    <button onClick={() => handleEdit(val.Item_id)}>Edit</button>
                                    <button onClick={() => handleView(val.Item_id)}>View</button>
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

export default Item;