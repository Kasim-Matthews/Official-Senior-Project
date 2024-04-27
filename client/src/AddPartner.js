import React from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";
import  Box  from '@mui/material/Box';
import  AppBar  from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import  IconButton  from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';

function AddPartner(){
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        Name:"",
        Email:"",
    })

    const [formErrors, setFormErrors] = React.useState({})

    function handleChange(event){
        setFormData(prevFormData => {
          return{
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
    await Axios.post("http://localhost:3001/partner/new", {
      name: formData.Name,
      email: formData.Email,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    window.location.href = "/partner";
  }
      function handleSubmit(e){
        e.preventDefault();
        
        Axios.post("http://localhost:3306/partner/new", {name:formData.Name,
        email:formData.Email},{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      });
        window.location.href = "/partner";
      }

      return(
        <div>
        <Navbar />
        <h2>Add Partner</h2>
        <form id="partnerForm" onSubmit={handleSubmit}>
          <TextField id="name" label="Name" variant="outlined" value={formData.Name} onChange={handleChange} required/><br></br>
          <TextField id="email" label="Email" variant="outlined" value={formData.Email} onChange={handleChange} required/><br></br>
          
          <Button type="submit">Submit</Button>
        
        </form>
        </div>
      );
}

export default AddPartner;