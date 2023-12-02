import React, { useState, useEffect } from "react";
import Axios from 'axios';

function Vendor() {

  const [vendorName, setVendorName] = React.useState("");
  const [organizationType, setOrganizationType] = React.useState(0);
  const [location, setLocation] = React.useState(0);
  const [notes, setNotes] = React.useState(0);

    const submitVendor = () => {
      Axios.post("http://localhost:3306/api/insert", {
        vendorName: vendorName, 
        organizationType: organizationType, 
        location: location, 
        notes: notes
      }).then(() => {
        alert("success");
      });
    }

  return (
    <div>
      <h2>Add Vendor</h2>
      <form id="add-vendor">
        <label htmlFor="vendorName">Vendor Name</label>
        <input type="text" name="Vendor Name" id="vendorName" required onChange={(e) => {setVendorName(e.target.value);}}/><br></br>
        
        <label htmlFor="organizationType">Organization Type</label>
        <input type="text" name="Organization Type" id="organizationType" required onChange={(e) => {setOrganizationType(e.target.value);}}/><br></br>

        <label htmlFor="location">Location</label>
        <input type="text" name="Location" id="location" onChange={(e) => {setLocation(e.target.value);}}/><br></br>

        <textarea name="notes" rows="4" cols="50" onChange={(e) => {setNotes(e.target.value);}} placeholder="Notes"></textarea><br></br>

        <button onClick={submitVendor}>Submit</button>

      </form>
    </div>
    
  );
}

export default Vendor;
