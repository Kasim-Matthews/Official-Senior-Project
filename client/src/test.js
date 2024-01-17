import React, { useEffect, useRef } from "react";
import Axios from 'axios';
import ItemInput from "./ItemInput";
import { useNavigate } from "react-router-dom";

function test (){
    const [index, setIndex] = React.useState(0);
    const [items, setItems] = React.useState([
        {
            name: `item [${index}]`,
            Item_id: 0,
            Location_id: 0,
            Quantity: 0,

        }
    ])

    const handleItem = (e, index) => {
        const values = [...items];
        values[index].Item_id = e.target.value;
        setItems(values)
    }
    const handleLocation = (e, index) => {
        const values = [...items];
        values[index].Location_id = e.target.value;
        setItems(values)
    }
    const handleQuantity = (e, index) => {
        const values = [...items];
        values[index].Quantity = e.target.value;
        setItems(values)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(items);
    }

    return(
        <div>
            <form>
                {items.map((obj, index) => {
                    <ItemInput
                        key={index}
                        objValue = {obj}
                        handleItem = {handleItem}
                        handleLocation = {handleLocation}
                        handleQuantity = {handleQuantity}
                        index = {index}
                    />
                })}
            </form>
        </div>
    )


}

export default test;