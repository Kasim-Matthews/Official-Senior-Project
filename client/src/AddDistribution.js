import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function AddDistribution(){
    const navigate = useNavigate();
    const [partners, setPartners] = React.useState([])
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
            state: formData.state},{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
            window.location.href = "/distribution";
      
          }

          useEffect(() => {
            Axios.get("http:////localhost:3001/partner").then((response) =>{
                    setPartners(response.data);
                })
          }, [])

          return(
            <form id="distribution" onSubmit={handleSubmit}>
                <label htmlFor="partner">Partner</label>
                <select id="Partner" name="Partner" value={formData.Partner} onChange={handleChange}>
                  <option value="">--Please choose an option--</option>
                  {partners.map((val) =>{
                    return(
                      <option value={val.name}>{val.name}</option>
                    )
                  })}
          
                </select>
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