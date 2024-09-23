import React, { useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function EditManufacturers() {

  const { id } = useParams();
  const [formData, setFormData] = React.useState({})
  const [formErrors, setFormErrors] = React.useState({})
  const navigate = useNavigate();

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
      window.location.href = "/manufacturers";
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

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/manufacturers/${id}/edit`).then((response) => {
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
    const regex_name = /^(?!.*SELECT|.*FROM|.*INSERT|.*UPDATE)(?=[a-zA-Z()\s]).*$/;


    if (!regex_name.test(formData.Name)) {
      errors.Name = "The name contains an SQL keyword !"
    }
    setFormErrors(errors)
    if (!errors.Name) {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    try {
      const response = await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/manufacturers/${id}/update`, { name: formData.Name }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/manufacturers";
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }
  }
  // return (
  //   <form id="edit location Form" onSubmit={validate}>
  //     <label htmlFor="Name">Name</label>
  //     <input type="text" name="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange} />
  //     {formErrors.Name ? <p>{formErrors.Name}</p> : null}
  //     <input type="submit" value="Submit" />
  //     <button type="button" onClick={handleCancel}>Cancel</button>
  //   </form>
  // )

  return (
    <>
      <Navbar />
      <Grid container justifyContent="center" >
        <Card
          sx={{ paddingtop: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CardContent>
            <h2>Edit Manufacturer</h2>
            <form id="edit location Form" onSubmit={validate}>
              <TextField variant="outlined" label="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange} sx={{ padding: "10px" }} />
              {formErrors.Name ? <p>{formErrors.Name}</p> : null}
              <Button variant="contained" type="submit" value="Submit">Submit</Button>
              <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default EditManufacturers;