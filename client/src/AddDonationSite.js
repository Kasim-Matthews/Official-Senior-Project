import React, { useState, useEffect } from "react";
import Axios from 'axios';
import DonationSite from './models/DonationSite';
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

function AddDonationSite(){
    const [formData, setFormData] = useState(DonationSite)
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
            window.location.href = "/donationsite";
        }
    }
    

    const validate = (e) => {
        e.preventDefault();
        const errors = {};
        const regex_name = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]).*$/;
        const regex_address = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]|[0-9]).*$/;

    
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
    }

    async function handleSubmit() {
        await Axios.post("http://localhost:3001/donationsite/new", {
          name: formData.Name,
          address: formData.Address
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        window.location.href = "/donationsite";
    }

    return(
        <div>
            <Navbar />
            <Grid container justifyContent="center" >
            <Card 
            sx={{ minWidth: 275 }}
            display="flex"
          alignItems="center"
          justifyContent="center">
                <CardContent>
                    <h2>Add Donation Site</h2>
            <form onSubmit={validate}>
              <div display="flex">
                <TextField id="outlined-basic" label="Name" variant="outlined" value={formData.Name} required onChange={handleChange}/>
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}

                <TextField id="outlined-basic" label="Address" variant="outlined" value={formData.Address} required onChange={handleChange}/>
                {formErrors.Address ? <p>{formErrors.Address}</p> : null}
              </div>

                <Button variant="contained" type="submit" value="Submit" />
                <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
        </div>
    )
}

export default AddDonationSite;