import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ProductDrive from "./models/ProductDrive";
import ItemInput from "./ItemInput";

function AddProductDrive() {
    const [formData, setFormData] = useState(ProductDrive)
    const todaysDate = new Date().toLocaleDateString();


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
                <label htmlFor="Name">Name</label>
                <input type="text" name="Name" id="Name" value={formData.Name} onChange={handleChange}/>

                <label htmlFor="StartDate">Start Date</label>
                <input type="date" name="StartDate" id="StartDate" value={formData.StartDate} min={todaysDate} onChange={handleChange}/>

                <label htmlFor="EndDate">End Date</label>
                <input type="date" name="EndDate" id="EndDate" value={formData.EndDate} min={todaysDate} onChange={handleChange}/>

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default AddProductDrive;