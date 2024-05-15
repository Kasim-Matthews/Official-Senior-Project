import React, { useEffect } from "react";
import Axios from 'axios';
import {
    Unstable_NumberInput as BaseNumberInput,
    numberInputClasses,
  } from '@mui/base/Unstable_NumberInput';

export default function ItemInput({ objName, handleItem, handleQuantity, index, deleteField }) {

    const [item, setItem] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/item/use").then((response) => {
            setItem(response.data);
        })
    }, [])


    return (
        <div style={{ display: "flex" }}>
            <FormControl size="small">
            <InputLabel id="item">Item</InputLabel>
            <NativeSelect
              placeholder="Please select an option"
              name={objName} onChange={(e) => handleItem(e, index)}
              inputProps={{
                name: 'item',
                id: 'item',
              }}>
             {partners.map((val) => {
           {item.map((val) => {
            return (
                <option value={val.Item_id}>{val.Name}</option>
            )
        })}
        })}
            </NativeSelect>
          </FormControl>

            <input type="number" name={objName} min="0" required onChange={(e) => handleQuantity(e, index)} />

            <div onClick={(e) => deleteField(e, index)}>X</div>
        </div>
    )
}