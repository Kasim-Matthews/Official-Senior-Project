import React from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function AddPartner(){
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        Name:"",
        Email:"",
    })

    function handleChange(event){
        setFormData(prevFormData => {
          return{
            ...prevFormData,
            [event.target.name]: event.target.value
          }
        })
      }

      function handleSubmit(e){
        e.preventDefault();
        
        Axios.post("https://diaper-bank-inventory-management-system.onrender.com/partner/new", {name:formData.Name,
        email:formData.Email},{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      });
        window.location.href = "/partner";
      }

      return(
        <form id="partnerForm" onSubmit={handleSubmit}>
            <label htmlFor="Name">Name</label>
            <input type="text" name="Name" id="Name" value={formData.Name} onChange={handleChange} required/>

            <label htmlFor="Email">Email</label>
            <input type="text" name="Email" value={formData.Email} id="Email" onChange={handleChange} required/>

            <input type="submit" value="Submit"/>
        </form>
      );
}

export default AddPartner;