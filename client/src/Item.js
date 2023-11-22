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

    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Market Value</td>
                    </tr>
                </thead>
                <tbody>
                    {itemList.map((val) => {
                        return(
                            <tr>
                                <td>{val.Name}</td>
                                <td>${val.marketValue}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Item;