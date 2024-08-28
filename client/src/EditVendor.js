import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


function EditVendor() {
  const { id } = useParams();
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`http://localhost:3001/vendor/${id}/edit`).then((response) => {
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
        window.location.href = "/vendor";
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
    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regex_phone = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/

    if (!regex_name.test(formData.BusinessName)) {
      errors.Name = "The name contains an SQL keyword !"
    }

    if (!regex_email.test(formData.Email) && formData.Email != "") {
      errors.Email = "This is not a valid email format!";
    }

    if (!regex_phone.test(formData.Phone) && formData.Phone != "") {
      errors.Phone = "This is not a valid phone number format!"
    }

    if (!regex_name.test(formData.ContactName) && formData.ContactName != "") {
      errors.ContactName = "The contact name contains an SQL keyword!"
    }
    setFormErrors(errors)
    if (!errors.Name && !errors.Email && !errors.Phone && !errors.ContactName) {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    await Axios.put(`http://localhost:3001/vendor/${id}/update`, {
      name: formData.BusinessName,
      phone: formData.Phone,
      email: formData.Email,
      contact: formData.ContactName,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    window.location.href = "/vendor";
  }

  return (
    <div>
      <Navbar/>
      <Grid container justifyContent="center" >
          <Card 
          sx={{ minWidth: 275 }} 
          display="flex"
          alignItems="center"
          justifyContent="center">
          <CardContent>
            <h2>Edit Vendor</h2>
      <form onSubmit={validate}>
      <div display="flex" padding="10px">
        <TextField  variant="outlined" name="BusinessName" id="BusinessName" defaultValue={formData.BusinessName} required onChange={handleChange} sx={{padding:"10px"}}/>
        {formErrors.Name ? <p>{formErrors.Name}</p> : null}
        <TextField  variant="outlined" name="ContactName" id="ContactName" defaultValue={formData.ContactName} onChange={handleChange} sx={{padding:"10px"}}/>
        {formErrors.ContactName ? <p>{formErrors.ContactName}</p> : null}
        <TextField  variant="outlined" name="Phone" id="Phone" defaultValue={formData.Phone} placeholder="XXX-XXX-XXXX" onChange={handleChange} sx={{padding:"10px"}}/>
        {formErrors.Phone ? <p>{formErrors.Phone}</p> : null}
        <TextField  variant="outlined" name="Email" id="Email" defaultValue={formData.Email} onChange={handleChange} sx={{padding:"10px"}}/>
        {formErrors.Email ? <p>{formErrors.Email}</p> : null}

      </div>
        <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit} sx={{padding:"10px"}}>Submit</Button>
        <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
      </form>
      </CardContent>
      </Card>
      </Grid>
    </div>
  )
}

export default EditVendor;