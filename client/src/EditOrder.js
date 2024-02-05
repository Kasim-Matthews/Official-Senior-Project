import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";
import Select from 'react-select';

function EditOrder() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = React.useState([])
  const [Partner_id, setPartner_id] = React.useState()
  const [partners, setPartners] = React.useState([])
  const [locations, setLocations] = React.useState([])

  const [index, setIndex] = React.useState(0);

  const [items, setItems] = React.useState([])

  const handleItem = (e, index) => {
    const values = [...items];
    values[index].Item = e.target.value;
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
          Quantity: 0,
          Item: 0
        }
      );
    }
    else {
      values.push(
        {
          Quantity: 0,
          Item: 0
        }
      );
    }

    setItems(values);
    console.log(items)
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



  useEffect(() => {
    Axios.get(`http://localhost:3001/distribution/${id}/edit`).then((response) => {
      setFormData(response.data[0]);
    })
  }, [])

  useEffect(() => {
    Axios.get(`http://localhost:3001/distribution/${id}/edititems`).then((response) => {
      setItems(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3001/partner/options").then((response) => {
      setPartners(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3001/location").then((response) => {
      setLocations(response.data);
    })
  }, [])



  function handleSubmit(e) {
    e.preventDefault();

    console.log(items)
    //Axios.put(`http://localhost:3001/distribution/${id}/update`, { Comments: formData.Comments, Status: formData.Status, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner_id }, {
    //  headers: {
     //   'Content-Type': 'application/x-www-form-urlencoded'
     // }
    //});

    //navigate('/distribution')


  }

  return (
    <form id="edit distribution" onSubmit={handleSubmit}>
      <label htmlFor="Partner">Partner</label>
      <select id="Partner_id" name="Partner_id" onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        {partners.map((val) => {
          if (val.value == formData.Partner_id) {

            return (
              <option value={val.value} selected>{val.label}</option>
            )
          }
          else {
            return (
              <option value={val.value}>{val.label}</option>
            )
          }
        })}

      </select><br />

      <label htmlFor="Location">Location</label>
      <select id="Location" name="Location" value={formData.Location} onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        {locations.map((val) => {
          if (val.Location_id == formData.Location_id) {

            return (
              <option value={val.Location_id} selected>{val.Name}</option>
            )
          }
          else {
            return (
              <option value={val.Location_id}>{val.Name}</option>
            )
          }
        })}

      </select><br />

      <label htmlFor="RequestDate">RequestDate</label>
      <input type="date" name="RequestDate" id="RequestDate" defaultValue={formData.RequestDate} min="2023-09-01" required onChange={handleChange} />

      <label htmlFor="CompletedDate">CompleteDate</label>
      <input type="date" name="CompletedDate" id="CompletedDate" defaultValue={formData.CompletedDate} min="2023-09-01" required onChange={handleChange} />

      <h3>Delivery Method</h3>

      <label htmlFor="Drop-off">Drop Off</label>
      <input type="radio" id="Drop-off" name="DeliveryMethod" value="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange} />
      <label htmlFor="Other">Other</label>
      <input type="radio" id="Other" name="DeliveryMethod" value="Other" checked={formData.DeliveryMethod === "Other"} onChange={handleChange} />

      <textarea name="Comments" rows="4" cols="50" onChange={handleChange} placeholder={formData.Comments}></textarea>

      <h2>Items</h2>
      {items.map((record, index) => (
        <div>
          <EditItemInput
          key={index}
          handleItem={handleItem}
          handleQuantity={handleQuantity}
          index={index}
          record={record}
          deleteField={handleDeleteField}
        />
        </div>

      ))}
      <button name="add-btn" onClick={handleAddField}>
        Add
      </button>


      <input type="submit" value="Submit" />
    </form>
  )
}

export default EditOrder;