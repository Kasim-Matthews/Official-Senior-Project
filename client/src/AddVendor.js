import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Vendor from "./models/Vendor";


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

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/vendor";
    }
}

  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    const regex_name = /^(?!.*SELECT|.*FROM|.*INSERT|.*UPDATE)(?=[a-zA-Z()\s]).*$/;
    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regex_phone = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/

    if (!regex_name.test(formData.BusinessName)) {
      errors.Name = "The name contains an SQL keyword !"
    }

    if (!regex_email.test(formData.Email) && formData.Email != "") {
      errors.Email = "This is not a valid email format!";
    }

    if (!regex_phone.test(formData.Phone) && formData.Phone != "") {
      errors.Phone = "This is not a valid phone number format!"
    }

    if (!regex_name.test(formData.ContactName) && formData.ContactName != "") {
      errors.ContactName = "The contact name contains an SQL keyword!"
    }
    setFormErrors(errors)
    if (!errors.Name && !errors.Email && !errors.Phone && !errors.ContactName) {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    try {
      const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/vendor/new`, {
        name: formData.BusinessName,
        phone: formData.Phone,
        email: formData.Email,
        contact: formData.ContactName
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      

      if(response.status == 400){
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200){
        window.location.href = "/vendor"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }
  }

  // return (
  //   <div>
  //     <form onSubmit={validate}>
  //       <label htmlFor="BusinessName">Business Name</label>
  //       <input type="text" name="BusinessName" id="BusinessName" value={formData.BusinessName} required onChange={handleChange} />
  //       {formErrors.Name ? <p>{formErrors.Name}</p> : null}
  //       <label htmlFor="ContactName">Contact Name</label>
  //       <input type="text" name="ContactName" id="ContactName" value={formData.ContactName} onChange={handleChange} />
  //       {formErrors.ContactName ? <p>{formErrors.ContactName}</p> : null}
  //       <label htmlFor="Phone">Phone</label>
  //       <input type="text" name="Phone" id="Phone" value={formData.Phone} placeholder="XXX-XXX-XXXX" onChange={handleChange} />
  //       {formErrors.Phone ? <p>{formErrors.Phone}</p> : null}
  //       <label htmlFor="Email">Email</label>
  //       <input type="text" name="Email" id="Email" value={formData.Email} onChange={handleChange} />
  //       {formErrors.Email ? <p>{formErrors.Email}</p> : null}


  //       <input type="submit" value="Submit" />
  //       <button type="button" onClick={handleCancel}>Cancel</button>
  //     </form>
  //   </div>
  // )

  return(
    <div>
      <Navbar />
      <Grid container justifyContent="center" >
      <Card 
      sx={{ marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <CardContent>
        <h2>Add Vendor</h2>
        
        <form onSubmit={validate}>
        <div display="flex" style={{paddingBottom: "10px"}}>
            <TextField variant="outlined" label="Business Name" id="BusinessName" value={formData.BusinessName} required onChange={handleChange} sx={{paddingRight:"10px"}}/>
            {formErrors.Name ? <p>{formErrors.Name}</p> : null}
            <TextField variant="outlined" label="ContactName" id="ContactName" value={formData.ContactName} onChange={handleChange} sx={{paddingRight:"10px"}}/>
            {formErrors.ContactName ? <p>{formErrors.ContactName}</p> : null}
            <TextField variant="outlined" label="Phone" id="Phone" value={formData.Phone} placeholder="XXX-XXX-XXXX" onChange={handleChange} sx={{paddingRight:"10px"}}/>
            {formErrors.Phone ? <p>{formErrors.Phone}</p> : null}
            <TextField variant="outlined" name="Email" id="Email" value={formData.Email} onChange={handleChange} sx={{paddingRight:"10px"}}/>
            {formErrors.Email ? <p>{formErrors.Email}</p> : null}
          </div>

            <Button variant="contained" type="submit" value="Submit" sx={{paddingRight:"10px"}}>Submit</Button>
            <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
        </form>
        </CardContent>
        </Card>
        </Grid>
    </div>
)
}

export default AddVendor;