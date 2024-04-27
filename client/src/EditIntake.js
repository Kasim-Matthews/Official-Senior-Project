import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";
import EditDriveList from "./components/EditDriveList";
import EditDonationSiteList from './components/EditDonationSiteList';
import EditManufacturerList from './components/EditManufacturerList';
import Navbar from "./components/navbar";

function EditIntake() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const [sourceType, setSourceType] = React.useState()
  const [formErrors, setFormErrors] = useState({})

  const [index, setIndex] = React.useState(0);

  const [items, setItems] = React.useState([])

  const Types = ["Product Drive", "Donation Site", "Manufacturer", "Misc Donation"]


  function listtype() {
    if (sourceType == "Product Drive") {
      return (
        <EditDriveList handleChange={handleChange} id={formData.Partner} />
      )
    }

    else if (sourceType == "Manufacturer") {
      return (
        <EditManufacturerList handleChange={handleChange} id={formData.Partner} />
      )
    }

    else if (sourceType == "Donation Site") {
      return (
        <EditDonationSiteList handleChange={handleChange} id={formData.Partner} />
      )
    }
  }


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
      setSourceType(response.data[0].Type)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    Axios.get(`http://localhost:3001/intake/${id}/edititems`).then((response) => {
      setItems(response.data);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    Axios.get("http://localhost:3001/location/use").then((response) => {
      setLocations(response.data);
    })
  }, [])

  const typechecker = async (e) => {
    e.preventDefault()
    if (sourceType == "Misc Donation") {
      await Axios.get("http://localhost:3001/intake/misc").then((response) => {
        setFormData(prevFormData => {
          return {
            ...prevFormData,
            Partner: response.data[0].Partner_id
          }
        })
      })
    }
    validate();
    return
  }

  const validate = () => {
    const errors = {};
    const regex_comments = /^(?!.*SELECT|.*FROM|.*WHERE|.*UPDATE|.*INSERT).*$/;


    if (!regex_comments.test(formData.Comments)) {
      errors.Comments = "The comments contains an SQL keyword !"
    }
    setFormErrors(errors)
    if (!errors.Comments) {
      handleSubmit()
    }
    return;
}

  async function handleSubmit() {

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
    let V_response = await Axios.post("http://localhost:3001/intake/find_value", { Items: items })
    let IL_response = await Axios.post("http://localhost:3001/intake/location", { Items: items, Location_id: formData.Location })

    await Axios.post("http://localhost:3001/intake/track", { Intake_id: id, Items: items, Values: V_response.data, FKItemLocation: IL_response.data });
    await Axios.put("http://localhost:3001/intake/update_item", { Items: items, ItemLocationFK: IL_response.data });
    navigate('/intake')

  }

  function sourceChange(event) {
    setSourceType(event.target.value)
    listtype(event.target.value)
  }


  return (
    <div>
      <Navbar />
      <h2>Intake</h2>
      <form id="intake" onSubmit={typechecker}>

        <Textfield select defaultValue="Source" helperText="Please select a source" id="Source" onChange={sourceChange}/>
          {Types.map((type) => {
            if (formData.Type == type) {
              return (
                <option value={type} selected>{type}</option>
              )
            }
            else {
              return (
                <option value={type}>{type}</option>
              )
            }
          })}
        <br />

        {sourceType != "" ? listtype() : null}



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

        <label htmlFor="RecievedDate">Issued On</label>
        <input type="date" name="RecievedDate" id="RecievedDate" min="2023-09-01" defaultValue={formData.RecievedDate} onChange={handleChange} /><br></br>

        <label htmlFor="Value">Money Raised</label>
        <input type="number" name="Value" id="Value" step="0.01" defaultValue={formData.Value == null ? 0.00 : formData.Value} onChange={handleChange} />
        <textarea name="Comments" rows="4" cols="50" defaultValue={formData.Comments} onChange={handleChange} placeholder={formData.Comments}></textarea><br></br>
        {formErrors.Comments ? <p>{formErrors.Comments}</p> : null}
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