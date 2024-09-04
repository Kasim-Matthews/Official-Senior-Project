import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Vendor from "./models/Vendor";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';


function AddVendor() {
    const [formData, setFormData] = useState(Vendor)
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
          window.location.href = "/vendor";
      }
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
        
        if (!regex_phone.test(formData.Phone) && formData.Phone != ""){
            errors.Phone = "This is not a valid phone number format!"
        }

        if (!regex_name.test(formData.ContactName) && formData.ContactName != ""){
            errors.ContactName = "The contact name contains an SQL keyword!"
        }
        setFormErrors(errors)
        if (!errors.Name && !errors.Email && !errors.Phone && !errors.ContactName) {
            handleSubmit()
        }
      }
    
      async function handleSubmit() {
          await Axios.post("http://localhost:3001/vendor/new", {
            name: formData.BusinessName,
            phone: formData.Phone,
            email: formData.Email,
            contact: formData.ContactName
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          window.location.href = "/vendor";
        }

    return(
        <div>
          <Navbar />
          <Grid container justifyContent="center" >
          <Card 
          sx={{ paddingtop:"10px" }} 
          display="flex"
          padding="10px"
          alignItems="center"
          justifyContent="center">
          <CardContent>
            <h2>Add Vendor</h2>
            
            <form onSubmit={validate}>
            <div display="flex" style={{paddingBottom: "10px"}}>
                <TextField variant="outlined" label="Business Name" id="BusinessName" value={formData.BusinessName} required onChange={handleChange} sx={{paddingRight:"10px"}}/>
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}
                <TextField variant="outlined" label="ContactName" id="ContactName" value={formData.ContactName} onChange={handleChange} sx={{paddingRight:"10px"}}/>
                {formErrors.ContactName ? <p>{formErrors.ContactName}</p> : null}
                <TextField variant="outlined" label="Phone" id="Phone" value={formData.Phone} placeholder="XXX-XXX-XXXX" onChange={handleChange} sx={{paddingRight:"10px"}}/>
                {formErrors.Phone ? <p>{formErrors.Phone}</p> : null}
                <TextField variant="outlined" name="Email" id="Email" value={formData.Email} onChange={handleChange} sx={{paddingRight:"10px"}}/>
                {formErrors.Email ? <p>{formErrors.Email}</p> : null}
              </div>

                <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit} sx={{paddingRight:"10px"}}>Submit</Button>
                <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
        </div>
    )
}

export default AddVendor;