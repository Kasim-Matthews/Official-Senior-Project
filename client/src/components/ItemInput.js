import React, { useEffect } from "react";
import Axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

export default function ItemInput({ objName, handleItem, handleQuantity, index, deleteField }) {

    const [item, setItem] = React.useState([])

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/item`).then((response) => {
            setItem(response.data.data);
        })
    }, [])


    // return (
    //     <div style={{ display: "flex" }}>
    //         <select name={objName} onChange={(e) => handleItem(e, index)}>
    //             <option value="">--Please choose an option--</option>
    //             {item.map((val) => {
    //                 return (
    //                     <option value={val.Item_id}>{val.Name}</option>
    //                 )
    //             })}
    //         </select>

    //         <input type="number" name={objName} min="0" required onChange={(e) => handleQuantity(e, index)} />

    //         <div onClick={(e) => deleteField(e, index)}>X</div>
    //     </div>
    // )

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

            <div style={{ display: "flex" }}>
                <input type="number" name={objName} min="0" required onChange={(e) => handleQuantity(e, index)} style={{ width: "80px", height: "20px", marginTop: "18px" }} />

                <div onClick={(e) => deleteField(e, index)} style={{ marginTop: "24px", paddingLeft: "8px", color: "red" }}>X</div>
            </div>
        </div>
    )
}