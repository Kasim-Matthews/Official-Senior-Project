import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ProductDrive from "./models/ProductDrive";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

function AddDrive() {
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
        const regex_name = /^(?!.*SELECT|.*FROM|.*INSERT|.*UPDATE)(?=[a-zA-Z()\s]).*$/;


        if (!regex_name.test(formData.Name)) {
            errors.Name = "The name contains an SQL keyword !"
        }
        setFormErrors(errors)
        if (!errors.Name) {
            handleSubmit()
        }
    }

    async function handleSubmit() {
        try {
            const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/productdrive/new`, {
                name: formData.Name
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });


            if (response.status == 400) {
                alert("Check the values you input. One of the values are not of the correct type.")
            }

            else if (response.status == 200) {
                window.location.href = "/productdrive"
            }
        }

        catch (error) {
            alert("Server side error/Contact developer")
        }
    }

    return(
        <div>
            <Navbar />
            <Grid container justifyContent="center" >
            <Card sx={{ marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <CardContent>
                <h2>Add Drive</h2>
            <form onSubmit={validate}>
            <div display="flex" padding="10px">
            <TextField id="name" label="Name" variant="outlined" type="text" value={formData.Name} required onChange={handleChange}sx={{paddingRight:"10px"}}/>
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}
            </div>
                <Button variant="contained" type="submit" value="Submit" sx={{paddingRight:"10px"}}>Submit</Button>
                <Button variant="outlined" type="button" onClick={handleCancel} sx={{paddingRight:"10px"}}>Cancel</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
        </div>
    )
}

export default AddDrive;