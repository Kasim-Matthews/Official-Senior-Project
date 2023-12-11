import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

function EditPartner(){
    
    const navigate = useNavigate();
    const {id} = useParams();
    const [formData, setFormData] = React.useState({})
    

    
        
        function handleChange(event){
            setFormData(prevFormData => {
              return{
                ...prevFormData,
                [event.target.name]: event.target.value
              }
            })
          }

          useEffect(() => {
            Axios.get(`http://localhost:3001/partner/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setFormData(key)});
            })
          }, [])

          

          function handleSubmit(e){
            e.preventDefault();
            
            Axios.put(`http://localhost:3001/partner/${id}/update`, {name:formData.Name,
            email:formData.Email},{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
            window.location.href = "/partner";
      
          }
          return(
            <form id="edit partnerForm" onSubmit={handleSubmit}>
              <label htmlFor="Name">Name</label>
              <input type="text" name="Name" id="Name" defaultValue={formData.Name} onChange={handleChange} required/>

              <label htmlFor="Email">Email</label>
              <input type="text" name="Email" defaultValue={formData.Email} id="Email" onChange={handleChange} required/>
    
                <input type="submit" value="Submit"/>
            </form>
          )
}

export default EditPartner;