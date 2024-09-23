import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

function EditDonationSite() {
  const { id } = useParams();
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/donationsite/${id}/edit`).then((response) => {
      if (response.data.status === 'complete') {
        response.data.data.map((key, value) => { setFormData(key) });
      }

      else if (response.data.status === 'error in query') {
        navigate('/query')
        console.error("Fail in the query")
        console.error(response.data.message)
      }
    }).catch(error => {
      navigate('/error')
      console.error(error.response.data.message)
    })
  }, [])

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/donationsite";
    }
}

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
    const regex_name = /^(?!.*SELECT|.*FROM|.*INSERT|.*UPDATE)(?=[a-zA-Z()\s]).*$/;
    const regex_address = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]|[0-9]).*$/;


    if (!regex_name.test(formData.Name)) {
      errors.Name = "The name contains an SQL keyword!"
    }

    if (!regex_address.test(formData.Address)) {
      errors.Address = "The address contains an SQL keyword!"
    }
    setFormErrors(errors)
    if (!errors.Name && !errors.Address) {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    try {
      const response = await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/donationsite/${id}/update`, {
        name: formData.Name,
        address: formData.Address
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/donationsite"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }

  }

  // return (
  //   <div>
  //     <form onSubmit={validate}>
  //       <label htmlFor="Name">Name</label>
  //       <input type="text" name="Name" id="Name" defaultValue={formData.Name} required onChange={handleChange} />
  //       {formErrors.Name ? <p>{formErrors.Name}</p> : null}

  //       <label htmlFor="Address">Address</label>
  //       <input type="text" name="Address" id="Address" defaultValue={formData.Address} required onChange={handleChange} />
  //       {formErrors.Address ? <p>{formErrors.Address}</p> : null}

  //       <input type="submit" value="Submit" />
  //       <button type="button" onClick={handleCancel}>Cancel</button>
  //     </form>
  //   </div>
  // )

  return (
    <div>
      <Navbar />
      <Grid container justifyContent="center" >
          <Card 
          sx={{ paddingtop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}} 
          >
          <CardContent>
            <h2>Edit Donation Site</h2>
      <form onSubmit={validate}>
      <div display="flex" padding="10px">
        <TextField variant="outlined" label="Name" id="Name" defaultValue={formData.Name} required onChange={handleChange} sx={{paddingRight:"10px"}} />
        {formErrors.Name ? <p>{formErrors.Name}</p> : null}

        <TextField variant="outlined" label="Address" id="Address" defaultValue={formData.Address} required onChange={handleChange} sx={{paddingRight:"10px"}}/>
        {formErrors.Address ? <p>{formErrors.Address}</p> : null}
      </div>
        <Button variant="contained" type="submit" value="Submit" sx={{paddingRight:"10px"}}/>
        <Button variant="outlined" type="button" onClick={handleCancel} sx={{paddingRight:"10px"}}>Cancel</Button>
      </form>
      </CardContent>
      </Card>
      </Grid>
    </div>
  )
}

export default EditDonationSite;