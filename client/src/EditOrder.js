import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";

function EditOrder() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = React.useState([])
  const [partners, setPartners] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const [formErrors, setFormErrors] = useState({})

  const [index, setIndex] = React.useState(0);

  const [items, setItems] = React.useState([])

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/distribution";
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
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/edit`).then((response) => {
      if (response.data.status === 'complete') {
        setFormData(response.data.data[0]);
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

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/edititems`).then((response) => {
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
  }, [])

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/partner/list`).then((response) => {
      if (response.data.status === 'complete') {
        setPartners(response.data.data);
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
    let ild = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/distribution/edit_validation`, { Items: items, Location_id: formData.Location_id });
    var result = []
    for (let o1 of ild.data.data) {
      for (let o2 of items) {
        if (o1.Item_id == o2.Item) {
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
      return
    }
  }

  async function handleSubmit() {
    try {
      const response = await await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/update`, { Comments: formData.Comments, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner_id, Items: items, Location_id: formData.Location_id });

      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/distribution"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }

  }

  return (
    <form id="edit distribution" onSubmit={validate}>
      <label htmlFor="Partner">Partner</label>
      <select id="Partner_id" name="Partner_id" onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        {partners.map((val) => {
          if (val.Partner_id == formData.Partner_id) {
            return (
              <option value={val.Partner_id} selected>{val.Name}</option>
            )
          }
          else {
            return (
              <option value={val.Partner_id}>{val.Name}</option>
            )
          }
        })}

      </select><br />

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

      <label htmlFor="RequestDate">RequestDate</label>
      <input type="date" name="RequestDate" id="RequestDate" Value={formData.RequestDate} required onChange={handleChange} />

      <label htmlFor="CompletedDate">CompleteDate</label>
      <input type="date" name="CompletedDate" id="CompletedDate" Value={formData.CompletedDate} min={formData.RequestDate} required onChange={handleChange} />

      <h3>Delivery Method</h3>

      <label htmlFor="Drop-off">Drop Off</label>
      <input type="radio" id="Drop-off" name="DeliveryMethod" value="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange} />
      <label htmlFor="Pick-up">Pick-up</label>
      <input type="radio" id="Pick-up" name="DeliveryMethod" value="Pick-up" checked={formData.DeliveryMethod === "Pick-up"} onChange={handleChange} />
      <label htmlFor="Shipped">Shipped</label>
      <input type="radio" id="Shipped" name="DeliveryMethod" value="Shipped" checked={formData.DeliveryMethod === "Shipped"} onChange={handleChange} />

      <textarea name="Comments" rows="4" cols="50" onChange={handleChange} placeholder={formData.Comments}></textarea>
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
      <button type="button" onClick={handleCancel}>Cancel</button>
    </form>
  )
}

export default EditOrder;