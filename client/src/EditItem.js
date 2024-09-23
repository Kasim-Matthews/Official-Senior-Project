import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function EditItem() {

  const { id } = useParams();
  const [formData, setFormData] = React.useState({})
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate();



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
        window.location.href = "/item";
    }
}


  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/item/${id}/edit`).then((response) => {
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


  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    const regex_name = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]).*$/;


    if (!regex_name.test(formData.Name)) {
      errors.Name = "The name contains an SQL keyword !"
    }
    setFormErrors(errors)
    if (!errors.Name) {
        handleSubmit()
    }
    return;
}


  async function handleSubmit() {
    try {
      const response = await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/item/${id}/update`, {
        name: formData.Name,
        FairMarketValue: formData.FairMarketValue,
        PackageCount: formData.PackageCount
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/item";
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }

    
    

  }

if (formData.PackageCount == null) {
  return (
    <form id="edit item" onSubmit={validate}>
      <label htmlFor="Name">Name</label>
      <input type="text" name="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange} />
      {formErrors.Name ? <p>{formErrors.Name}</p> : null}

      <label htmlFor="FairMarketValue">Fair Market Value</label>
      <input type="number" name="FairMarketValue" id="FairMarketValue" defaultValue={formData.FairMarketValue} step="0.01" required onChange={handleChange} />

      <label htmlFor="PackageCount">Package Count</label>
      <input type="number" name="PackageCount" id="PackageCount" value="0" step="1" onChange={handleChange} />

      <input type="submit" value="Submit" />
      <button type="button" onClick={handleCancel}>Cancel</button>
    </form>
  )
}

else {
  return (
    <form id="edit item" onSubmit={validate}>
      <label htmlFor="Name">Name</label>
      <input type="text" name="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange} />
      {formErrors.Name ? <p>{formErrors.Name}</p> : null}

      <label htmlFor="FairMarketValue">Fair Market Value</label>
      <input type="number" name="FairMarketValue" id="FairMarketValue" defaultValue={formData.FairMarketValue} step="0.01" required onChange={handleChange} />

      <label htmlFor="PackageCount">Package Count</label>
      <input type="number" name="PackageCount" id="PackageCount" value={formData.PackageCount} step="1" onChange={handleChange} />

      <input type="submit" value="Submit" />
      <button type="button" onClick={handleCancel}>Cancel</button>
    </form>
  )
}

// return(
//   <>
//   <Navbar />
//   <Grid container justifyContent="center" >
// <Card 
// sx={{ paddingtop: "50px", display: "flex", alignItems: "center", justifyContent: "center" }} 
// >
// <CardContent>
//   <h2>Edit Item</h2>
//   <form id="edit item" onSubmit={handleSubmit}>
//   <div display="flex" padding="10px">
//       <TextField variant="outlined" label="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange} sx={{padding:"10px"}}/>

//       <TextField variant="outlined" name="FairMarketValue" id="FairMarketValue" defaultValue={formData.FairMarketValue} step="0.01" required onChange={handleChange} sx={{padding:"10px"}} />
//   </div>
//       <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit}>Submit</Button>
//   </form>
//   </CardContent>
//   </Card>
//   </Grid>
//   </>
// )


}

export default EditItem;