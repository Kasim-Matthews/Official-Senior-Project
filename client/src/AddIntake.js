import React, { useState, useEffect } from "react";
import Axios from 'axios';

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
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/partner").then((response) => {
      setPartners(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/item").then((response) =>{
            setItems(response.data);
        })
  }, [])

  useEffect(() => {
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/location").then((response) =>{
            setLocations(response.data);
        })
  }, [])

  const submitPurchase = async (e) => {
    e.preventDefault()

    Axios.post("https://diaper-bank-inventory-management-system.onrender.com/intake/new", {Comments: formData.Comments, RecievedDate: formData.RecievedDate, Value: formData.Value, Partner: formData.Partner })
    
    let IL_response = await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/distribution/find_ild", {Item_id: formData.item, Location_id: formData.location})

    let IID_response = await Axios.get("https://diaper-bank-inventory-management-system.onrender.com/intake/find_id");

    Axios.post("https://diaper-bank-inventory-management-system.onrender.com/intake/track", {Intake_id: IID_response.data[0].Intake_id, Quantity: formData.Quantity, Value: formData.Value, FKItemLocation: IL_response.data[0].ItemLocation_id});

    let current = await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/intake/find_q", {ItemLocationFK: IL_response.data[0].ItemLocation_id})

    Axios.put("https://diaper-bank-inventory-management-system.onrender.com/intake/update_item", {Quantity: formData.Quantity, ItemLocationFK: IL_response.data[0].ItemLocation_id, CurrentQ: current.data[0].Quantity});

    window.location.href = "/intake";
  }

  return (
    <div>
      <h2>Intake</h2>
      <form id="intake" onSubmit={submitPurchase}>
        <label htmlFor="Partner">Partner</label>
        <select id="Partner" name="Partner" value={formData.Partner} onChange={handleChange}>
          <option value="">--Please choose an option--</option>
          {partners.map((val) => {
            return (
              <option value={val.Partner_id}>{val.Name}</option>
            )
          })}
        </select>
        <br></br>

        <label htmlFor="RecievedDate">Recieved Date</label>
        <input type="date" name="RecievedDate" id="RecievedDate" min="2023-09-01" value={formData.RecievedDate} onChange={handleChange} /><br></br>

        <label htmlFor="Value">Value</label>
        <input type="number" name="Value" id="Value" step="0.01" value={formData.Value} onChange={handleChange}/>
        <textarea name="Comments" rows="4" cols="50" value={formData.Comments} onChange={handleChange} placeholder="Comment"></textarea><br></br>

        <h2>Items</h2>
        <div style={{ display: "flex" }}>
          <select id="item" name="item" value={formData.item} onChange={handleChange}>
            <option value="">--Please choose an option--</option>
            {items.map((val) => {
              return (
                <option value={val.Item_id}>{val.Name}</option>
              )
            })}
          </select>

          <select id="location" name="location" value={formData.location} onChange={handleChange}>
            <option value="">--Please choose an option--</option>
            {locations.map((val) => {
              return (
                <option value={val.Location_id}>{val.Name}</option>
              )
            })}
          </select>

          <input type="number" name="Quantity" id="Quantity" required onChange={handleChange} value={formData.Quantity} />
        </div>

        <input type="submit" value="Submit" />

      </form>
    </div>

  );
}

export default AddIntake;
