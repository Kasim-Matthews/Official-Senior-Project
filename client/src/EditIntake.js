import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";

function EditIntake() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = React.useState([])
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
    Axios.get(`http://localhost:3001/intake/${id}/edit`).then((response) => {
      setFormData(response.data[0]);
    })
  }, [])

  useEffect(() => {
    Axios.get(`http://localhost:3001/intake/${id}/edititems`).then((response) => {
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

  async function handleSubmit(e) {
    e.preventDefault();
    let GetData = async function (id) {
      return await Axios.get(`http://localhost:3001/intake/${id}/cleanup`).then((response) => {
        return response
      });
    }
    let data = GetData(id)
    data.then(async (response) => {
      await Axios.put("http://localhost:3001/intake/reclaim", { records: response.data })
    })


    await Axios.delete(`http://localhost:3001/intake/${id}/edit_delete`)
    
    await Axios.put(`http://localhost:3001/intake/${id}/update`, { Comments: formData.Comments, RecievedDate: formData.RecievedDate, Partner: formData.Partner, Value: formData.Value }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    for (const item of items) {

      let IL_response = await Axios.post("http://localhost:3001/intake/location", { Item_id: String(item.Item), Location_id: String(formData.Location_id) })

      let V_response = await Axios.post("http://localhost:3001/intake/find_value", { Item_id: String(item.Item) })

      await Axios.post("http://localhost:3001/intake/track", { Intake_id: id, Quantity: item.Quantity, Value: item.Quantity * V_response.data[0].FairMarketValue, FKItemLocation: IL_response.data[0].ItemLocation_id });

      let current = await Axios.post("http://localhost:3001/intake/find_q", { ItemLocationFK: IL_response.data[0].ItemLocation_id })

      await Axios.put("http://localhost:3001/intake/update_item", { Quantity: item.Quantity, ItemLocationFK: IL_response.data[0].ItemLocation_id, CurrentQ: current.data[0].Quantity });

    }
    navigate('/intake')

    navigate('/intake')


  }

  return (
    <div>
      <h2>Intake</h2>
      <form id="intake" onSubmit={handleSubmit}>
        <label htmlFor="Partner">Partner</label>
        <select id="Partner" name="Partner" onChange={handleChange}>
          <option value="">--Please choose an option--</option>
          {partners.map((val) => {
            if (val.value == formData.Partner) {

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

        </select>
        <br></br>
        <label htmlFor="Location">Location</label>
        <select id="Location_id" name="Location_id" value={formData.Location_id} onChange={handleChange}>
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

        <label htmlFor="RecievedDate">Recieved Date</label>
        <input type="date" name="RecievedDate" id="RecievedDate" min="2023-09-01" defaultValue={formData.RecievedDate} onChange={handleChange} /><br></br>

        <label htmlFor="Value">Value</label>
        <input type="number" name="Value" id="Value" step="0.01" defaultValue={formData.Value} onChange={handleChange} />
        <textarea name="Comments" rows="4" cols="50" defaultValue={formData.Comments} onChange={handleChange} placeholder={formData.Comments}></textarea><br></br>

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
    </div>
  )
}

export default EditIntake;