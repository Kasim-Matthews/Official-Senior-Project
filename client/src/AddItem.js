import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Item from "./models/Item";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

function AddItem() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState(Item)
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
      window.location.href = "/item";
    }
  }

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
      const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/item/new`, {
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
        window.location.href = "/item"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }


  }


  return (
    <>
      <Navbar />
      <Grid container justifyContent="center" >
        <Card
          sx={{ marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CardContent>
            <h2>Add Item</h2>
            <form id="item" onSubmit={validate}>
              <div display="flex" padding="10px">
                <TextField variant="outlined" label="Name" value={formData.Name} id="Name" required onChange={handleChange} sx={{ paddingRight: "10px" }} />
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}
                <TextField variant="outlined" label="Fair Market Value" id="FairMarketValue" value={formData.FairMarketValue} step="0.01" required onChange={handleChange} sx={{ paddingRight: "10px" }} />

                <TextField variant="outlined" label="PackageCount" id="PackageCount" value={formData.PackageCount} step="1" required onChange={handleChange} sx={{ paddingRight: "10px" }} />

              </div>



              <Button variant="contained" type="submit" value="Submit" sx={{ paddingRight: "10px" }}>Submit</Button>
              <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}
/* 
          return(
            <>
            <Navbar />
            <Grid container justifyContent="center" >
            <Card 
            sx={{ marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <CardContent>
                <h2>Add Item</h2>
            <form id="item" onSubmit={handleSubmit}>
              <div display="flex" padding="10px">
                <TextField variant="outlined" label="Name" value={formData.Name} id="Name" required onChange={handleChange} sx={{paddingRight:"10px"}}/>
                
                <TextField variant="outlined" label="Fair Market Value" id="FairMarketValue" value={formData.FairMarketValue} step="0.01" required onChange={handleChange} sx={{paddingRight:"10px"}}/>
                </div>
                
                <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit} sx={{paddingRight:"10px"}}>Submit</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
            </>
          )
*/

export default AddItem;