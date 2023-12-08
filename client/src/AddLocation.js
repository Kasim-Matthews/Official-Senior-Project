import React from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function AddLocation(){
    const navigate = useNavigate();
    
    const [formData, setFormData] = React.useState(
        {
          Name: "",
          Adress: "",
          totalInventory: 0,
          marketValue: 0.00,
        }
        )
        
        
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
            try{
                Axios.post("http://localhost:3001/location/new", {name:formData.Name,
                Adress:formData.Adress,
                totalInventory:formData.totalInventory,
                marketValue:formData.marketValue},{
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }
            catch(error){
                console.log(error.response.data);
            }
            window.location.href = "/location";
          }

          return(
            <form id="locations" onSubmit={handleSubmit}>
                <label htmlFor="Name">Name</label>
                <input type="text" name="Name" value={formData.Name} id="Name" required onChange={handleChange}/>

                <label htmlFor="Adress">Adress</label>
                <input type="text" name="Adress" value={formData.Adress} id="Adress" required onChange={handleChange}/>


                <input type="submit" value="Submit"/>
            </form>
          )
}

export default AddLocation;