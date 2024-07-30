import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ProductDrive from "./models/ProductDrive";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

function AddDrive(){
    const [formData, setFormData] = useState(ProductDrive)
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
            window.location.href = "/productdrive";
        }
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
        await Axios.post("http://localhost:3001/productdrive/new", {
          name: formData.Name
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        window.location.href = "/productdrive";
    }

    return(
        <div>
            <Navbar />
            <Grid container justifyContent="center" >
            <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <h2>Add Drive</h2>
            <form onSubmit={validate}>
            <div display="flex">
            <TextField id="name" label="Name" variant="outlined" type="text" value={formData.Name} required onChange={handleChange}/>
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}
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

export default AddDrive;