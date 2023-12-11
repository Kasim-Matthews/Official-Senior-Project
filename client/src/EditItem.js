import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

function EditItem(){
    
    const navigate = useNavigate();
    const {id} = useParams();
    const [isActive, setIsActive] = React.useState(true)
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
            Axios.get(`http://localhost:3001/item/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setFormData(key)});
            })
          }, [])

          

          function handleSubmit(e){
            e.preventDefault();
            
            Axios.put(`http://localhost:3001/item/${id}/update`, {name:formData.Name,
            FairMarketValue:formData.FairMarketValue},{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
            window.location.href = "/item";
      
          }
          return(
            <form id="edit item" onSubmit={handleSubmit}>
                 <label htmlFor="Name">Name</label>
                <input type="text" name="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange}/>
                
                <label htmlFor="FairMarketValue">Fair Market Value</label>
                <input type="number" name="FairMarketValue" id="FairMarketValue" defaultValue={formData.FairMarketValue} step="0.01" required onChange={handleChange}/>

                <input type="submit" value="Submit"/>
            </form>
          )
}

export default EditItem;