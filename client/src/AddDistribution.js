import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";
import Partner from "./Partner";

function AddDistribution(){
    const navigate = useNavigate();
    const [partners, setPartners] = React.useState([])
    const [items, setItems] = React.useState([])
    const [locations, setLocations] = React.useState([])
    const [formData, setFormData] = React.useState(
        {
          Partner: 0,
          RequestDate: "",
          CompletedDate: "",
          item:0,
          location:0,
          Quantity: 0,
          DeliveryMethod: "",
          Comments: "",
          status: "Draft",
        }
      )

        const addItem = 
        <div style={{display: "flex"}}>
          <select id="item" name="item" value={formData.item} onChange={handleChange}>
            <option value="">--Please choose an option--</option>
            {items.map((val) =>{
                    return(
                      <option value={val.Item_id}>{val.Name}</option>
                    )
            })}
          </select>

          <select id="location" name="location" value={formData.location} onChange={handleChange}>
            <option value="">--Please choose an option--</option>
            {locations.map((val) =>{
                    return(
                      <option value={val.Location_id}>{val.Name}</option>
                    )
                  })}
          </select>
          <input type="number" name="Quantity" id="Quantity" required onChange={handleChange} value={formData.Quantity}/>
        </div>
        
        function handleChange(event){
            setFormData(prevFormData => {
              return{
                ...prevFormData,
                [event.target.name]: event.target.value
              }
            })
          }

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            Axios.post("http://localhost:3306/distribution/new", {Comments: formData.Comments, Status: formData.status, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id:formData.Partner},{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
          let IL_response = await Axios.post("http://localhost:3306/distribution/find_ild", {Item_id: formData.item, Location_id: formData.location})
          
          let OID_response = await Axios.post("http://localhost:3306/distribution/find_id", {RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner});

          let V_response = await Axios.post("http://localhost:3306/distribution/find_value", {Item_id: formData.item})

          Axios.post("http://localhost:3306/distribution/track", {Order_id: OID_response.data[0].Order_id, Quantity: formData.Quantity, Value: formData.Quantity * V_response.data[0].FairMarketValue, ItemLocationFK: IL_response.data[0].ItemLocation_id});
          
          let current = await Axios.post("http://localhost:3306/distribution/find_q", {ItemLocationFK: IL_response.data[0].ItemLocation_id})
          Axios.put("http://localhost:3306/distribution/update_item", {Quantity: formData.Quantity, ItemLocationFK: IL_response.data[0].ItemLocation_id, CurrentQ: current.data[0].Quantity});

         
          
            window.location.href = "/distribution";
      
          }

          useEffect(() => {
            Axios.get("http://localhost:3306/partner").then((response) =>{
                    setPartners(response.data);
                })
          }, [])
          
          useEffect(() => {
            Axios.get("http://localhost:3306/item").then((response) =>{
                    setItems(response.data);
                })
          }, [])

          useEffect(() => {
            Axios.get("http://localhost:3306/location").then((response) =>{
                    setLocations(response.data);
                })
          }, [])


          

          return(
            <form id="distribution" onSubmit={handleSubmit}>
                <label htmlFor="Partner">Partner</label>
                <select id="Partner" name="Partner" value={formData.Partner} onChange={handleChange}>
                  <option value="">--Please choose an option--</option>
                  {partners.map((val) =>{
                    return(
                      <option value={val.Partner_id}>{val.Name}</option>
                    )
                  })}
          
                </select><br/>
                <label htmlFor="RequestDate">RequestDate</label>
                <input type="date" name="RequestDate" id="RequestDate" value={formData.RequestDate} min="2023-09-01" required onChange={handleChange}/>
                
                <label htmlFor="CompletedDate">CompleteDate</label>
                <input type="date" name="CompletedDate" id="CompletedDate" value={formData.CompletedDate} min="2023-09-01" required onChange={handleChange}/>

                <p>Delivery Method</p>

                <label htmlFor="Drop-off">Drop Off</label>
                <input type="radio" id="Drop-off" name="DeliveryMethod" value="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange}/>
                <label htmlFor="Other">Other</label>
                <input type="radio" id="Other" name="DeliveryMethod" value="Other" checked={formData.DeliveryMethod === "Other"} onChange={handleChange}/>

                <textarea name="Comments" rows="4" cols="50" onChange={handleChange} placeholder="Comments"></textarea>


                  <h2>Items</h2>
                  <div style={{display: "flex"}}>
                    <select id="item" name="item" value={formData.item} onChange={handleChange}>
                      <option value="">--Please choose an option--</option>
                      {items.map((val) =>{
                              return(
                                <option value={val.Item_id}>{val.Name}</option>
                              )
                      })}
                    </select>

                    <select id="location" name="location" value={formData.location} onChange={handleChange}>
                      <option value="">--Please choose an option--</option>
                      {locations.map((val) =>{
                              return(
                                <option value={val.Location_id}>{val.Name}</option>
                              )
                            })}
                    </select>
          
                    <input type="number" name="Quantity" id="Quantity" required onChange={handleChange} value={formData.Quantity}/>
                  </div>
                <input type="submit" value="Submit"/>
            </form>
          )
}

export default AddDistribution;