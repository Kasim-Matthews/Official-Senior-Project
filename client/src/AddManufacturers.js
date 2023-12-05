import React from "react";
import './Distribution.css';
import Axios from 'axios';

function AddManufacturers(){
    
    const [formData, setFormData] = React.useState(
        {
          Name: "",
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
                Axios.post("http://localhost:3001/manufacturers/new", {name:formData.Name,},{
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }
            catch(error){
                console.log(error.response.data);
            }
            window.location.href = "/manufacturers";
          }

          return(
            <form id="locations" onSubmit={handleSubmit}>
                <label htmlFor="Name">Name</label>
                <input type="text" name="Name" value={formData.Name} id="Name" required onChange={handleChange}/>
                <input type="submit" value="Submit"/>
            </form>
          )
}

export default AddManufacturers;