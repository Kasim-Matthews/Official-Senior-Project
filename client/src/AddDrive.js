import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ProductDrive from "./models/ProductDrive";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';

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
            <form onSubmit={validate}>
            <TextField id="name" label="Name" variant="outlined" type="text" value={formData.Name} required onChange={handleChange}/>
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}

                <input type="submit" value="Submit" />
                <button onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    )
}

export default AddDrive;