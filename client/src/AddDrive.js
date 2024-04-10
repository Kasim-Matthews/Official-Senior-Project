import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ProductDrive from "./models/ProductDrive";

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
        await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/productdrive/new", {
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
            <form onSubmit={validate}>
                <label htmlFor="Name">Name</label>
                <input type="text" name="Name" id="Name" value={formData.Name} required onChange={handleChange}/>
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default AddDrive;