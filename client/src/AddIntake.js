import React, { useState, useEffect } from "react";
import Axios from 'axios';

function AddIntake() {

  const [formData, setFormData] = React.useState({
    Comments: "",
    RecievedDate: "",
    Value: 0.00,
    Partner: 0
  })

  const [partners, setPartners] = React.useState([])

  function handleChange(event){
    setFormData(prevFormData => {
      return{
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

    useEffect(() => { Axios.get("http:////localhost:3001/partner").then((response) =>{
      setPartners(response.data);
      })
    }, [])

    const submitPurchase = (e) => {
      e.preventDefault()

      Axios.post("http:////localhost:3001/intake/new", {Comments: formData.Comments, RecievedDate: formData.RecievedDate, Value: formData.Value, Partner: formData.Partner})
      window.location.href = "/intake";
    }

  return (
    <div>
      <h2>Intake</h2>
      <form id="intake" onSubmit={submitPurchase}>
        <label htmlFor="Partner">Partner</label>
        <select id="Partner" name="Partner" value={formData.Partner} onChange={handleChange}>
          <option value="">--Please choose an option--</option>
          {partners.map((val) =>{
                    return(
                      <option value={val.Partner_id}>{val.Name}</option>
                    )
          })}
        </select>
        <br></br>
        
        <label htmlFor="RecievedDate">Recieved Date</label>
        <input type="date" name="RecievedDate" id="RecievedDate" min="2023-09-01" value={formData.RecievedDate} onChange={handleChange}/><br></br>

        <label htmlFor="Value">Value</label>
        <input type="number" name="Value" id="Value" value={formData.Value} step="0.01" onChange={handleChange}/><br></br>

        <textarea name="Comments" rows="4" cols="50" value={formData.Comments} onChange={handleChange} placeholder="Comment"></textarea><br></br>

        <input type="submit" value="Submit"/>

      </form>
    </div>
    
  );
}

export default AddIntake;
