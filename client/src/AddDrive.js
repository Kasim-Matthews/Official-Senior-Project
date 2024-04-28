import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ProductDrive from "./models/ProductDrive";

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

    return (
        <div>
            <form onSubmit={validate}>
                <label htmlFor="Name">Name</label>
                <input type="text" name="Name" id="Name" value={formData.Name} required onChange={handleChange} />
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}

                <input type="submit" value="Submit" />
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    )
}

export default AddDrive;