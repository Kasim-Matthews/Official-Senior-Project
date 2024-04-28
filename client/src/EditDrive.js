import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";


function EditDrive() {
  const { id } = useParams();
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate();


  useEffect(() => {
    Axios.get(`http://localhost:3001/productdrive/${id}/edit`).then((response) => {
      if (response.data.status === 'complete') {
        response.data.data.map((key, value) => { setFormData(key) });
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


  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/productdrive";
    }
}


  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    const regex_name = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]).*$/;


    if (!regex_name.test(formData.Name)) {
      errors.Name = "The name contains an SQL keyword !"
    }
    setFormErrors(errors)
    if (!errors.Name) {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    await Axios.put(`http://localhost:3001/productdrive/${id}/update`, {
      name: formData.Name
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(window.location.href = "/Dashboard");
  }

  return (
    <div>
      <Navbar />
      <form onSubmit={validate}>
        <TextField variant="outlined" label="Name" id="Name" defaultValue={formData.Name} required onChange={handleChange} />
        {formErrors.Name ? <p>{formErrors.Name}</p> : null}

        <input type="submit" value="Submit" />
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  )
}

export default EditDrive;