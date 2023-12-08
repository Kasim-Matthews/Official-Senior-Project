import React, { useEffect } from "react";
import Axios from 'axios';
import {useParams} from "react-router-dom";

function EditLocation(){
    
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
            Axios.get(`http://localhost:3001/location/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setFormData(key)});
            })
          }, [])

          

          function handleSubmit(e){
            e.preventDefault();
            
            Axios.put(`http://localhost:3001/location/${id}/update`, {name:formData.Name,
            Adress:formData.Adress,
            totalInventory:formData.totalInventory,
            marketValue:formData.marketValue},{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
            window.location.href = "/location";
      
          }
          return(
            <form id="edit location Form" onSubmit={handleSubmit}>
                <label htmlFor="Name">Name</label>
                <input type="text" name="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange}/>

                <label htmlFor="Adress">Adress</label>
                <input type="text" name="Adress" defaultValue={formData.Adress} id="Adress" required onChange={handleChange}/>
    
                <input type="submit" value="Submit"/>
            </form>
          )
}

export default EditLocation;