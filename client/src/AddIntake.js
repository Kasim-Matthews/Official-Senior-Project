import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';


function AddIntake() {

  const [formData, setFormData] = React.useState({
    Comments: "",
    RecievedDate: "",
    Value: 0.00,
    Partner: 0,
    location: 0,
    item: 0,
    Quantity: 0,
    ItemLocationFK: 0
  })

  const [partners, setPartners] = React.useState([])
  const [items, setItems] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const [itemLocation, setItemLocation] = React.useState([])

  

  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  useEffect(() => {
    Axios.get("http://localhost:3306/partner").then((response) => {
      setPartners(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3306/item").then((response) =>{
            setItems(response.data);
        })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3306/location").then((response) =>{
            setLocations(response.data);
        })
  }, [])

  const submitPurchase = async (e) => {
    e.preventDefault()

    Axios.post("http://localhost:3306/intake/new", {Comments: formData.Comments, RecievedDate: formData.RecievedDate, Value: formData.Value, Partner: formData.Partner })
    
    let IL_response = await Axios.post("http://localhost:3306/distribution/find_ild", {Item_id: formData.item, Location_id: formData.location})

    let IID_response = await Axios.get("http://localhost:3306/intake/find_id");

    Axios.post("http://localhost:3306/intake/track", {Intake_id: IID_response.data[0].Intake_id, Quantity: formData.Quantity, Value: formData.Value, FKItemLocation: IL_response.data[0].ItemLocation_id});

    let current = await Axios.post("http://localhost:3306/intake/find_q", {ItemLocationFK: IL_response.data[0].ItemLocation_id})

    Axios.put("http://localhost:3306/intake/update_item", {Quantity: formData.Quantity, ItemLocationFK: IL_response.data[0].ItemLocation_id, CurrentQ: current.data[0].Quantity});

    window.location.href = "/intake";
  }

  return (
    <div>
      <Navbar /> 
      <h2>Intake</h2>
      <form id="intake" onSubmit={submitPurchase}>
      <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="Partner">Partner</InputLabel>
        <NativeSelect>
        {partners.map((val) => {
          return (
            <option value={val.Partner_id}>{val.Name}</option>
          )
        })}
        </NativeSelect>
      </FormControl>
    </Box>
        <TextField select defaultValue="Partner" helperText="Please select a partner" id="Partner" label="Partner" variant="outlined" value={formData.Partner} onChange={handleChange}/>
          {partners.map((val) => {
            return (
              <option value={val.Partner_id}>{val.Name}</option>
            )
          })}
        <br></br>

        <label htmlFor="RecievedDate">Recieved Date</label>
        <input type="date" name="RecievedDate" id="RecievedDate" min="2023-09-01" value={formData.RecievedDate} onChange={handleChange} /><br></br>

        <label htmlFor="Value">Value</label>
        <input type="number" name="Value" id="Value" step="0.01" value={formData.Value} onChange={handleChange}/>
        <textarea name="Comments" rows="4" cols="50" value={formData.Comments} onChange={handleChange} placeholder="Comment"></textarea><br></br>

        <h2>Items</h2>
        <div style={{ display: "flex" }}>
          <Textfield select defaultValue="Item Name" helperText="Please select an item" id="item" name="item" value={formData.item} onChange={handleChange}/>
            {items.map((val) => {
              return (
                <option value={val.Item_id}>{val.Name}</option>
              )
            })}

          <Textfield select defaultValue="Location" helperText="Please select a location" id="location" name="location" value={formData.location} onChange={handleChange}/>
            {locations.map((val) => {
              return (
                <option value={val.Location_id}>{val.Name}</option>
              )
            })}

          <input type="number" name="Quantity" id="Quantity" required onChange={handleChange} value={formData.Quantity} />
        </div>

        <Button variant="contained" type="submit" value="Submit" />

      </form>
    </div>

  );
}

export default AddIntake;
