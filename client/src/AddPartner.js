import React from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function AddPartner(){
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        Name:"",
        Email:"",
        Comments:"",
        Representative:""
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
        
        Axios.post("http://localhost:3001/partner/new", {name:formData.Name,
        email:formData.Email,
        comments:formData.Comments,
        representative:formData.Representative},{
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

            <label htmlFor="Comments">Comments</label><br/>
            <textarea name="Comments" id="Comments" value={formData.Comments} rows="4" cols="50" onChange={handleChange}></textarea><br/>
            
            <label htmlFor="Representative">Agency Representative</label>
            <input type="text" name="Representative" id="Representative" value={formData.Representative} onChange={handleChange}/>

            <input type="submit" value="Submit"/>
        </form>
      );
}

export default AddPartner;