import React, { useEffect } from "react";
import {useParams} from "react-router-dom";
import Axios from 'axios';

export default function ItemInput({ record, handleItem, handleQuantity, index, deleteField }) {

    const { id } = useParams();
    const [item, setItem] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/item").then((response) => {
            setItem(response.data);
        })
    }, [])

    return (
        <div style={{ display: "flex" }}>
            <select onChange={(e) => handleItem(e, index)}>
                <option value="">--Please choose an option--</option>
                {item.map((val) => {
                    if(val.Item_id == record.Item){
                        return (
                            <option value={val.Item_id} selected>{val.Name}</option>
                        )
                    }
                    
                    else{
                        return (
                            <option value={val.Item_id}>{val.Name}</option>
                        )
                    }
                })}
            </select>

            <input type="number" defaultValue={record.Quantity} required onChange={(e) => handleQuantity(e, index)} />
            <br/>

            <div onClick={(e) => deleteField(e, index)}>X</div>
        </div>
    )
}