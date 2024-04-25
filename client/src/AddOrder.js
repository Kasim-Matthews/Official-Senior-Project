import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ItemInput from "./components/ItemInput";
import Distribution from "./models/Distribution";
import { useNavigate } from "react-router-dom";

function AddOrder() {
  const navigate = useNavigate();
  const [partners, setPartners] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const [formData, setFormData] = React.useState(Distribution)
  const [formErrors, setFormErrors] = useState({})

  const [index, setIndex] = React.useState(1);

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


  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
      window.location.href = "/distribution";
    }
  }

  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    const regex_comments = /^(?!.*SELECT|.*FROM|.*WHERE|.*UPDATE|.*INSERT).*$/;


    if (!regex_comments.test(formData.Comments)) {
      errors.Comments = "The comments contains an SQL keyword !"
    }
    setFormErrors(errors)
    if (!errors.Comments) {
      quantityCheck()
    }
    return;
  }

  const quantityCheck = async () => {
    let ild = await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/distribution/validation", { Items: items, Location_id: formData.Location });
    var result = []
    for (let o1 of ild.data.data) {
      for (let o2 of items) {
        if (o1.Item_id == o2.Item_id) {
          if (o1.Quantity < o2.Quantity) {
            result.push(o1.Item);
          }
        }
      }
    }

    if (result.length == 0) {
      handleSubmit()
      return
    }
    else {
      alert(`There is not a sufficient amount of ${result.toString()} to complete the transfer`)
    }
  }


  const handleSubmit = async () => {
    try {
      const response = await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/distribution/new", { Comments: formData.Comments, Status: formData.status, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner, Items: items, Location_id: formData.Location }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      

      if(response.status == 400){
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200){
        window.location.href = "/distribution"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }

  }

  useEffect(() => {
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/partner/list").then((response) => {
      setPartners(response.data.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/location/use").then((response) => {
      setLocations(response.data.data);
    })
  }, [])





  return (
    <form id="distribution" onSubmit={validate}>
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
      <input type="date" name="CompletedDate" id="CompletedDate" value={formData.CompletedDate} min={formData.RequestDate} required onChange={handleChange} />




      <h3>Delivery Method</h3>

      <label htmlFor="Drop-off">Drop Off</label>
      <input type="radio" id="Drop-off" name="DeliveryMethod" value="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange} />
      <label htmlFor="Pick-up">Pick-up</label>
      <input type="radio" id="Pick-up" name="DeliveryMethod" value="Pick-up" checked={formData.DeliveryMethod === "Pick-up"} onChange={handleChange} />
      <label htmlFor="Shipped">Shipped</label>
      <input type="radio" id="Shipped" name="DeliveryMethod" value="Shipped" checked={formData.DeliveryMethod === "Shipped"} onChange={handleChange} />

      <textarea name="Comments" rows="4" cols="50" onChange={handleChange} placeholder="Comments"></textarea>
      {formErrors.Comments ? <p>{formErrors.Comments}</p> : null}

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
      <button onClick={handleCancel}>Cancel</button>
    </form>
  )
}

export default AddOrder;