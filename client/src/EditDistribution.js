import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

function EditDistribution(){
    
    const navigate = useNavigate();
    const {id} = useParams();
    const [formData, setFormData] = React.useState({})
    

    
        
        function handleChange(event){
            setFormData(prevFormData => {
              return{
                ...prevFormData,
                [event.target.name]: event.target.value
              }
            })
          }

          useEffect(() => {
            Axios.get(`http://localhost:3001/distribution/${id}/view`).then((response) => {
            response.data.map((key, value) => {setFormData(key)});
            })
          }, [])

          

          function handleSubmit(e){
            e.preventDefault();
            
            Axios.put(`http://localhost:3001/distribution/${id}/update`, {partner:formData.Partner, 
            date:formData.date, 
            source:formData.source, 
            totalitems: formData.totalItems, 
            value: formData.value, 
            deliverymethod: formData.deliverymethod, 
            comments: formData.comments, 
            state: formData.state},{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
            window.location.href = "/distribution";
      
          }
    return(
        <form id="edit distribution" onSubmit={handleSubmit}>
                <label htmlFor="partner">Partner</label>
                <input type="text" name="Partner" id="partner" defaultValue={formData.partner} required onChange={handleChange}/>
                
                <label htmlFor="date">Date</label>
                <input type="date" name="date" id="date" defaultValue={formData.date} min="2023-09-01" required onChange={handleChange}/>

                <label htmlFor="source">Source</label>
                <input type="text" name="source" defaultValue={formData.source} id="source" required onChange={handleChange}/>

                <label htmlFor="total-items">Total-Items</label>
                <input type="number" name="totalItems" defaultValue={formData.totalitems} id="total-items" required onChange={handleChange}/>

                <label htmlFor="value">Value</label>
                <input type="number" id="value" defaultValue={formData.value} name="value" step=".01" onChange={handleChange}/>

                <p>Delivery Method</p>

                <label htmlFor="pickup">Pickup</label>
                <input type="radio" id="pickup" name="deliveryMethod" value="Pickup" checked={formData.deliverymethod === "Pickup"} onChange={handleChange}/>
                <label htmlFor="delivery">Delivery</label>
                <input type="radio" id="delivery" name="deliveryMethod" value="Delivery" checked={formData.deliverymethod === "Delivery"} onChange={handleChange}/>

                <textarea name="comments" rows="4" cols="50" onChange={handleChange} defaultValue={formData.comments}></textarea>

                <input type="submit" value="Submit"/>
            </form>
    )
}

export default EditDistribution;