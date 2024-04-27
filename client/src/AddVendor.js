import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Vendor from "./models/Vendor";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';


function AddVendor() {
    const [formData, setFormData] = useState(Vendor)
    const [formErrors, setFormErrors] = useState({})

    function handleChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const validate = (e) => {
        e.preventDefault();
        const errors = {};
        const regex_name = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]).*$/;
        const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const regex_phone = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    
        if (!regex_name.test(formData.BusinessName)) {
          errors.Name = "The name contains an SQL keyword !"
        }
    
        if (!regex_email.test(formData.Email) && formData.Email != "") {
          errors.Email = "This is not a valid email format!";
        }
        
        if (!regex_phone.test(formData.Phone) && formData.Phone != ""){
            errors.Phone = "This is not a valid phone number format!"
        }

        if (!regex_name.test(formData.ContactName) && formData.ContactName != ""){
            errors.ContactName = "The contact name contains an SQL keyword!"
        }
        setFormErrors(errors)
        if (!errors.Name && !errors.Email && !errors.Phone && !errors.ContactName) {
            handleSubmit()
        }
      }
    
      async function handleSubmit() {
          await Axios.post("http://localhost:3001/vendor/new", {
            name: formData.BusinessName,
            phone: formData.Phone,
            email: formData.Email,
            contact: formData.ContactName
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          window.location.href = "/vendor";
        }

    return(
        <div>
          <Navbar />
            <form onSubmit={validate}>
                <Textfield variant="outlined" label="Business Name" id="BusinessName" value={formData.BusinessName} required onChange={handleChange}/>
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}
                <Textfield variant="outlined" label="ContactName" id="ContactName" value={formData.ContactName} onChange={handleChange}/>
                {formErrors.ContactName ? <p>{formErrors.ContactName}</p> : null}
                <Textfield variant="outlined" label="Phone" id="Phone" value={formData.Phone} placeholder="XXX-XXX-XXXX" onChange={handleChange}/>
                {formErrors.Phone ? <p>{formErrors.Phone}</p> : null}
                <Textfeild variant="outlined" name="Email" id="Email" value={formData.Email} onChange={handleChange}/>
                {formErrors.Email ? <p>{formErrors.Email}</p> : null}


                <Button variant="contained" type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default AddVendor;