import React from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function AddItem(){
    const navigate = useNavigate();
    
    const [isActive, setIsActive] = React.useState(true)
    const [formData, setFormData] = React.useState(
        {
          Name: "",
          marketValue: 0.00,
          packageSize:0,
          active: 0
        }
        )
        
        function handleChecked(event){
            setIsActive(current => !current)
        }
        
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
            formData.active = isActive ? 1 : 0
            try{
                console.log(formData.Name);
                
                Axios.post("http://localhost:3001/item/new", {name:formData.Name,
                marketValue:formData.marketValue,
                packageSize:formData.packageSize,
                active:formData.active},{
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }
            catch(error){
                console.log(error.response.data);
            }
          }

          return(
            <form id="item" onSubmit={handleSubmit}>
                <label htmlFor="Name">Name</label>
                <input type="text" name="Name" value={formData.Name} id="Name" required onChange={handleChange}/>
                
                <label htmlFor="marketValue">Fair Market Value</label>
                <input type="number" name="marketValue" id="marketValue" value={formData.marketValue} step="0.01" required onChange={handleChange}/>

                <label htmlFor="packageSize">Package Size</label>
                <input type="number" name="packageSize" value={formData.packageSize} id="packageSize" required onChange={handleChange}/>

                
                <input type="checkbox" id="isActive" defaultChecked={isActive} name="isActive" onChange={() => setIsActive(!isActive)}/>
                <label htmlFor="isActive">Is the item active</label>

                <input type="submit" value="Submit"/>
            </form>
          )
}

export default AddItem;