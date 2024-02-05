import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Purchase from "./models/Purchase";
import ItemInput from "./components/ItemInput";

function AddPurchase() {
    const [formData, setFormData] = useState(Purchase)
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
            <h2>Purchase</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Vendor">Vendor</label>
                <input type="text" name="Vendor" id="Vendor" value={formData.Vendor} onChange={handleChange}/>

                <label htmlFor="Location">Location</label>
                <input type="text" name="Location" id="Location" value={formData.Location} onChange={handleChange}/>
                
                <label htmlFor="Total">Purchase Total</label>
                <input type="number" name="Total" id="Total" value={formData.Total} min="0.00" step="0.01" onChange={handleChange}/>

                <label htmlFor="Comment">Comment</label><br/>
                <textarea name="Comment" rows="4" cols="50" value={formData.Comment} onChange={handleChange} placeholder="Comment"></textarea><br/>

                <label htmlFor="Purchase_date">Purchase date</label>
                <input type="date" name="Purchase_date" id="Purchase_date" value={formData.Purchase_date} min={todaysDate} onChange={handleChange}/>


                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default AddPurchase;