import React from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function AddDistribution(){
    const navigate = useNavigate();
    
    const [formData, setFormData] = React.useState(
        {
          Partner: "",
          date: "",
          source: "",
          totalItems: 0,
          value: 0,
          deliveryMethod: "",
          comments: "",
          state: true
        }
        )
        
        function handleChange(event){
            setFormData(prevFormData => {
              return{
                ...prevFormData,
                [event.target.name]: event.target.value
              }
            })
          }

        function handleSubmit(e){
            e.preventDefault();
            
            Axios.post("http://localhost:3001/distribution/new", {partner:formData.Partner, 
            date:formData.date, 
            source:formData.source, 
            totalitems: formData.totalItems, 
            value: formData.value, 
            deliverymethod: formData.deliveryMethod, 
            comments: formData.comments, 
            state: formData.state});
            window.location.href = "/distribution";
      
          }

          return(
            <form id="distribution" onSubmit={handleSubmit}>
                <label htmlFor="partner">Partner</label>
                <input type="text" name="Partner" value={formData.Partner} id="partner" required onChange={handleChange}/>
                
                <label htmlFor="date">Date</label>
                <input type="date" name="date" id="date" value={formData.date} min="2023-09-01" required onChange={handleChange}/>

                <label htmlFor="source">Source</label>
                <input type="text" name="source" value={formData.source} id="source" required onChange={handleChange}/>

                <label htmlFor="total-items">Total-Items</label>
                <input type="number" name="totalItems" value={formData.totalItems} id="total-items" required onChange={handleChange}/>

                <label htmlFor="value">Value</label>
                <input type="number" id="value" value={formData.value} name="value" step=".01" onChange={handleChange}/>

                <p>Delivery Method</p>

                <label htmlFor="pickup">Pickup</label>
                <input type="radio" id="pickup" name="deliveryMethod" value="Pickup" checked={formData.deliveryMethod === "Pickup"} onChange={handleChange}/>
                <label htmlFor="delivery">Delivery</label>
                <input type="radio" id="delivery" name="deliveryMethod" value="Delivery" checked={formData.deliveryMethod === "Delivery"} onChange={handleChange}/>

                <textarea name="comments" rows="4" cols="50" onChange={handleChange} placeholder="Comments"></textarea>

                <input type="submit" value="Submit"/>
            </form>
          )
}

export default AddDistribution;