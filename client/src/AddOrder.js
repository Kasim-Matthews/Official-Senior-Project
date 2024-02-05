import React, { useEffect, useRef } from "react";
import Axios from 'axios';
import ItemInput from "./components/ItemInput";
import Distribution from "./models/Distribution";
import { useNavigate } from "react-router-dom";

function AddOrder() {
  const navigate = useNavigate();
  const [partners, setPartners] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const [toggle, setToggle] = React.useState(false)
  const [formData, setFormData] = React.useState(Distribution)

  const [index, setIndex] = React.useState(0);
  
  const [items, setItems] = React.useState([
    {
      name: `item [${index}]`,
      Item_id: 0,
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





  const handleSubmit = async (e) => {
    e.preventDefault();

    Axios.post("http://localhost:3001/distribution/new", { Comments: formData.Comments, Status: formData.status, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    for (const item of items){
      let IL_response = await Axios.post("http://localhost:3001/distribution/find_ild", { Item_id: item.Item_id, Location_id: formData.Location })

      let OID_response = await Axios.post("http://localhost:3001/distribution/find_id", { RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner });
  
      let V_response = await Axios.post("http://localhost:3001/distribution/find_value", { Item_id: item.Item_id })
  
      Axios.post("http://localhost:3001/distribution/track", { Order_id: OID_response.data[0].Order_id, Quantity: item.Quantity, Value: item.Quantity * V_response.data[0].FairMarketValue, ItemLocationFK: IL_response.data[0].ItemLocation_id });
  
      let current = await Axios.post("http://localhost:3001/distribution/find_q", { ItemLocationFK: IL_response.data[0].ItemLocation_id })
      Axios.put("http://localhost:3001/distribution/update_item", { Quantity: item.Quantity, ItemLocationFK: IL_response.data[0].ItemLocation_id, CurrentQ: current.data[0].Quantity });
    }

    window.location.href = "/distribution";

  }

  useEffect(() => {
    Axios.get("http://localhost:3001/partner").then((response) => {
      setPartners(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3001/location").then((response) => {
        setLocations(response.data);
    })
}, [])





  return (
    <form id="distribution" onSubmit={handleSubmit}>
      <label htmlFor="Partner">Partner</label>
      <select id="Partner" name="Partner" value={formData.Partner} onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        {partners.map((val) => {
          return (
            <option value={val.Partner_id}>{val.Name}</option>
          )
        })}

      </select><br />

      <label htmlFor="Location">Location</label>
      <select id="Location" name="Location" value={formData.Location} onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        {locations.map((val) => {
          return (
            <option value={val.Location_id}>{val.Name}</option>
          )
        })}

      </select><br />
      <label htmlFor="RequestDate">RequestDate</label>
      <input type="date" name="RequestDate" id="RequestDate" value={formData.RequestDate} min="2023-09-01" required onChange={handleChange} />

      <label htmlFor="CompletedDate">CompleteDate</label>
      <input type="date" name="CompletedDate" id="CompletedDate" value={formData.CompletedDate} min="2023-09-01" required onChange={handleChange} />




      <h3>Delivery Method</h3>

      <label htmlFor="Drop-off">Drop Off</label>
      <input type="radio" id="Drop-off" name="DeliveryMethod" value="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange} />
      <label htmlFor="Other">Other</label>
      <input type="radio" id="Other" name="DeliveryMethod" value="Other" checked={formData.DeliveryMethod === "Other"} onChange={handleChange} />

      <textarea name="Comments" rows="4" cols="50" onChange={handleChange} placeholder="Comments"></textarea>


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
  )
}

export default AddOrder;