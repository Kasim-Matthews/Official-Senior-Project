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

function EditPartner() {

  const { id } = useParams();
  const [formData, setFormData] = React.useState({})
  const [formErrors, setFormErrors] = React.useState({})
  const navigate = useNavigate();

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
      window.location.href = "/partner";
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
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/partner/${id}/edit`).then((response) => {
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
    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!regex_name.test(formData.Name) && formData.Name != "") {
      errors.Name = "The name contains an SQL keyword !"
    }

    if (!regex_email.test(formData.Email) && formData.Email != "") {
      errors.Email = "This is not a valid email format!";
    }

    setFormErrors(errors);
    if (!errors.Name && !errors.Email) {
      handleSubmit()
    }
  }


  async function handleSubmit() {
    try {
      const response = await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/partner/${id}/update`, {
        name: formData.Name,
        email: formData.Email
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/partner";
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }
  }
  // return (
  //   <form id="edit partnerForm" onSubmit={validate}>
  //     <div>
  //       <label htmlFor="Name">Name</label>
  //       <input type="text" name="Name" id="Name" defaultValue={formData.Name} onChange={handleChange} required />
  //     </div>

  //     {formErrors.Name ? <p>{formErrors.Name}</p> : null}

  //     <div>
  //       <label htmlFor="Email">Email</label>
  //       <input type="text" name="Email" defaultValue={formData.Email} id="Email" onChange={handleChange} required />
  //     </div>

  //     {formErrors.Email ? <p>{formErrors.Email}</p> : null}

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
            <h2>Edit Partner</h2>
            <form id="edit partnerForm" onSubmit={validate}>
              <div display="flex" padding="10px">
                <TextField varaint="outlined" name="Name" id="Name" defaultValue={formData.Name} onChange={handleChange} required sx={{ padding: "10px" }} />
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}

                <TextField variant="outlined" type="text" name="Email" defaultValue={formData.Email} id="Email" onChange={handleChange} required sx={{ padding: "10px" }} />
                {formErrors.Email ? <p>{formErrors.Email}</p> : null}

              </div>
              <Button varaint="contained" type="submit" value="Submit">Submit</Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default EditPartner;