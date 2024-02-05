import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Vendor from "./models/Vendor";
import ItemInput from "./ItemInput";

function AddVendor() {
    const [formData, setFormData] = useState(Vendor)


    function handleChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
    }

    return(
        <div>
            <h2>Product Drive</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="BusinessName">Business Name</label>
                <input type="text" name="BusinessName" id="BusinessName" value={formData.BusinessName} onChange={handleChange}/>

                <label htmlFor="ContactName">Contact Name</label>
                <input type="text" name="ContactName" id="ContactName" value={formData.ContactName} onChange={handleChange}/>

                <label htmlFor="Phone">Phone</label>
                <input type="tel" name="Phone" id="Phone" value={formData.Phone} placeholder="XXX-XXX-XXXX" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onChange={handleChange}/>

                <label htmlFor="Email">Email</label>
                <input type="text" name="Email" id="Email" value={formData.Email} onChange={handleChange}/>

                <label htmlFor="Address">Address</label>
                <input type="text" name="Address" id="Address" value={formData.Address} onChange={handleChange}/>


                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default AddVendor;