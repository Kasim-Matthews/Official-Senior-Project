import React, { useEffect } from "react";
import Axios from 'axios';
import {
    Unstable_NumberInput as BaseNumberInput,
    numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';


export default function ItemInput({ objName, handleItem, handleQuantity, index, deleteField }) {

    const [item, setItem] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/item/use").then((response) => {
            setItem(response.data);
        })
    }, [])


    return (
        <div style={{ display: "flex", paddingBottom: "10px" }}>
            <FormControl size="small" sx={{ paddingRight: "10px" }}>
                <InputLabel id="item">Item</InputLabel>
                <NativeSelect
                    placeholder="Please select an option"
                    name={objName} onChange={(e) => handleItem(e, index)}
                    inputProps={{
                        name: 'item',
                        id: 'item',
                    }}>

                    {item.map((val) => {
                        return (
                            <option value={val.Item_id}>{val.Name}</option>
                        )
                    })}

                </NativeSelect>
            </FormControl>

            <div style={{display: "flex"}}>
                <input type="number" name={objName} min="0" required onChange={(e) => handleQuantity(e, index)} style={{width: "80px", height: "20px", marginTop: "18px"}} />

                <div onClick={(e) => deleteField(e, index)} style={{marginTop: "24px", paddingLeft:"8px", color: "red"}}>X</div>
            </div>
        </div>
    )
}