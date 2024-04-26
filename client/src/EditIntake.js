import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";
import EditDriveList from "./components/EditDriveList";
import EditDonationSiteList from './components/EditDonationSiteList';
import EditManufacturerList from './components/EditManufacturerList'

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

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/intake";
    }
}

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
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/intake/${id}/edit`).then((response) => {
      if (response.data.status === 'complete') {
        setFormData(response.data.data[0]);
        setSourceType(response.data.data[0].Type)
      }
      else if (response.data.status === 'error in query') {
        navigate('/query')
        console.error("Fail in the query")
        console.error(response.data.message)
      }

    }).catch(error => {
      navigate('/error')
      console.error(error.response.data.message)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/intake/${id}/edititems`).then((response) => {
      if (response.data.status === 'complete') {
        setItems(response.data.data);
      }
      else if (response.data.status === 'error in query') {
        navigate('/query')
        console.error("Fail in the query")
        console.error(response.data.message)
      }

    }).catch(error => {
      navigate('/error')
      console.error(error.response.data.message)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/location/use`).then((response) => {
      if (response.data.status === 'complete') {
        setLocations(response.data.data);
      }
      else if (response.data.status === 'error in query') {
        navigate('/query')
        console.error("Fail in the query")
        console.error(response.data.message)
      }

    }).catch(error => {
      navigate('/error')
      console.error(error.response.data.message)
    })
  }, [])

  const typechecker = async (e) => {
    e.preventDefault()
    if (sourceType == "Misc Donation") {
      await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/intake/misc`).then((response) => {
        formData.Partner = response.data.data[0].Partner_id
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
    try {
      const response = await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/intake/${id}/update`, { Comments: formData.Comments, RecievedDate: formData.RecievedDate, Partner: formData.Partner, Value: formData.TotalValue, Items: items, Location_id: formData.Location_id }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/intake"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }





  }

  function sourceChange(event) {
    setSourceType(event.target.value)
    listtype(event.target.value)
  }

  console.log(parseFloat(formData.TotalValue))

  return (
    <div>
      <h2>Intake</h2>
      <form id="intake" onSubmit={typechecker}>

        <label htmlFor="Source">Source</label>
        <select id="Source" onChange={sourceChange}>
          <option value="" disabled></option>
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
        </select>
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
        <input type="number" name="TotalValue" id="TotalValue" step="0.01" value={parseFloat(formData.TotalValue) == null ? 0.00 : parseFloat(formData.TotalValue)} onChange={handleChange} />
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
        <button onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  )
}

export default EditIntake;