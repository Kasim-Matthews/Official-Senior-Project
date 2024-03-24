import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ItemInput from "./components/ItemInput";
import DriveList from "./components/DriveList";
import ManufacturerList from "./components/ManufacturerList";
import DonationSiteList from "./components/DonationSiteList";

function AddIntake() {

  const [formData, setFormData] = React.useState({
    Comments: "",
    RecievedDate: "",
    Value: 0.00,
    Partner: 0,
    Location: 0
  })
  const [sourceType, setSourceType] = React.useState("")
  const [locations, setLocations] = React.useState([])

  const Types = ["Product Drive", "Donation Site", "Manufacturer", "Misc Donation"]

  const [index, setIndex] = React.useState(0);
  const [items, setItems] = React.useState([
    {
      name: `item [${index}]`,
      Item_id: 0,
      Quantity: 0,

    }
  ])

  function listtype(){
    if(sourceType == "Product Drive"){
      return(
        <DriveList handleChange={handleChange}/>
      )
    }

    else if(sourceType == "Manufacturer"){
      return(
        <ManufacturerList handleChange={handleChange}/>
      )
    }

    else if(sourceType == "Donation Site"){
      return(
        <DonationSiteList handleChange={handleChange}/>
      )
    }
  }

  const handleItem = (e, index) => {
    const values = [...items];
    values[index].Item_id = e.target.value;
    setItems(values)
  }

  const handleQuantity = (e, index) => {
    const values = [...items];
    values[index].Quantity = e.target.value;
    setItems(values)
  }

  const handleAddField = (e) => {
    e.preventDefault();
    setIndex(index + 1);
    const values = [...items];
    if (values.length === 0) {
      values.push(
        {
          name: `item [${0}]`,
          Item_id: 0,
          Quantity: 0,
        }
      );
    }
    else {
      values.push(
        {
          name: `item [${index}]`,
          Item_id: 0,
          Quantity: 0,
        }
      );
    }

    setItems(values);
  }

  const handleDeleteField = (e, index) => {
    const values = [...items];
    values.splice(index, 1);
    setItems(values);
  };



  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  function sourceChange(event) {
    setSourceType(event.target.value)
    listtype(event.target.value)
  }



  useEffect(() => {
    Axios.get("http://localhost:3001/location").then((response) => {
      setLocations(response.data);
    })
  }, [])

  async function typechecker(){
    if(sourceType == "Misc Donation"){
      await Axios.get("http://localhost:3001/intake/misc").then((response) => {
        setFormData(prevFormData => {
          return {
            ...prevFormData,
            Partner: response.data[0].Partner_id
          }
        })
      })
    }
  }
  const submitPurchase = async (e) => {
    e.preventDefault()
    typechecker();

    await Axios.post("http://localhost:3001/intake/new", { Comments: formData.Comments, RecievedDate: formData.RecievedDate, Partner: formData.Partner })
    for (const item of items) {
      let IL_response = await Axios.post("http://localhost:3001/intake/location", { Item_id: item.Item_id, Location_id: formData.Location })

      let IID_response = await Axios.get("http://localhost:3001/intake/find_id");

      let V_response = await Axios.post("http://localhost:3001/intake/find_value", { Item_id: item.Item_id })

      Axios.post("http://localhost:3001/intake/track", { Intake_id: IID_response.data[0].Intake_id, Quantity: item.Quantity, Value: item.Quantity * V_response.data[0].FairMarketValue, FKItemLocation: IL_response.data[0].ItemLocation_id });

      let current = await Axios.post("http://localhost:3001/intake/find_q", { ItemLocationFK: IL_response.data[0].ItemLocation_id })

      Axios.put("http://localhost:3001/intake/update_item", { Quantity: item.Quantity, ItemLocationFK: IL_response.data[0].ItemLocation_id, CurrentQ: current.data[0].Quantity });

    }

    window.location.href = "/intake";
  }


  return (
    <div>
      <h2>Intake</h2>
      <form id="intake" onSubmit={submitPurchase}>

        <label htmlFor="Source">Source</label>
        <select id="Source" value={sourceType} onChange={sourceChange}>
          <option value="" disabled></option>
          {Types.map((type) => {
            return(
              <option value={type}>{type}</option>
            )
          })}
        </select>
        <br />
        {sourceType != "" ? listtype() : null}

        <label htmlFor="Location">Location</label>
        <select id="Location" name="Location" value={formData.Location} onChange={handleChange}>
          <option value="">--Please choose an option--</option>
          {locations.map((val) => {
            return (
              <option value={val.Location_id}>{val.Name}</option>
            )
          })}

        </select><br />

        <label htmlFor="RecievedDate">Recieved Date</label>
        <input type="date" name="RecievedDate" id="RecievedDate" min="2023-09-01" value={formData.RecievedDate} onChange={handleChange} /><br></br>

        <label htmlFor="Value">Value</label>
        <input type="number" name="Value" id="Value" step="0.01" value={formData.Value} onChange={handleChange} />
        <textarea name="Comments" rows="4" cols="50" value={formData.Comments} onChange={handleChange} placeholder="Comment"></textarea><br></br>

        <h2>Items</h2>
        {items.map((obj, index) => (
          <ItemInput
            key={index}
            objName={obj.name}
            handleItem={handleItem}
            handleQuantity={handleQuantity}
            index={index}
            deleteField={handleDeleteField}
          />
        ))}
        <button name="add-btn" onClick={handleAddField}>
          Add
        </button>

        <input type="submit" value="Submit" />

      </form>
    </div>

  );
}

export default AddIntake;
