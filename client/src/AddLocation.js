import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Location from './models/Location'
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

function AddLocation() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState(Location)
  const [formErrors, setFormErrors] = useState({})


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
        window.location.href = "/location";
    }
}

  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    const regex_name = /^(?!.*SELECT|.*FROM|.*INSERT|.*UPDATE)(?=[a-zA-Z()\s]).*$/;
    const regex_address = /^(?!.*SELECT|.*FROM|.*INSERT|.*UPDATE)(?=[a-zA-Z()\s]|[0-9]).*$/;


    if (!regex_name.test(formData.Name)) {
      errors.Name = "The name contains an SQL keyword or a special character!"
    }

    if (!regex_address.test(formData.Address)) {
      errors.Address = "The address contains an SQL keyword !"
    }
    setFormErrors(errors)
    if (!errors.Name && !errors.Address) {
      handleSubmit()
    }
    return;
  }

  async function handleSubmit() {
    try {
      const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/location/new`, {
        name: formData.Name,
        Address: formData.Address
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      

      if(response.status == 400){
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200){
        window.location.href = "/location"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }

  }



  return(
    <>
    <Navbar />
    <Grid container justifyContent="center" >
    <Card 
    sx={{ marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}>
    <CardContent>
      <h2>Add Location</h2>
    <form id="locations" onSubmit={validate}>
      <div display="flex" padding="10px">
        <TextField variant="outlined" label="Name" value={formData.Name} id="Name" required onChange={handleChange} sx={{paddingRight:"10px"}}/>
        {formErrors.Name ? <p>{formErrors.Name}</p> : null}

        <TextField variant="outlined" name="Address" value={formData.Address} id="Address" required onChange={handleChange} sx={{paddingRight:"10px"}}/>
        {formErrors.Address ? <p>{formErrors.Address}</p> : null}
        </div>
        <Button variant="contained" type="submit" value="Submit" sx={{paddingRight:"10px"}}>Submit</Button>
        <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
    </form>
    </CardContent>
    </Card>
    </Grid>
  </>
  )
}

export default AddLocation;