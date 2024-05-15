import React from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

function AddItem(){
    const navigate = useNavigate();
    
    const [isActive, setIsActive] = React.useState(true)
    const [formData, setFormData] = React.useState(
        {
          Name: "",
          FairMarketValue: 0.00,
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
                
                Axios.post("http://localhost:3306/item/new", {name:formData.Name,
                FairMarketValue:formData.FairMarketValue},{
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }
            catch(error){
                console.log(error.response.data);
            }

            window.location.href = "/item";
          }

          return(
            <>
            <Navbar />
            <Grid container justifyContent="center" >
            <Card 
            sx={{ minWidth: 275 }}
            display="flex"
          alignItems="center"
          justifyContent="center">
              <CardContent>
                <h2>Add Item</h2>
            <form id="item" onSubmit={handleSubmit}>
                <TextField variant="outlined" label="Name" value={formData.Name} id="Name" required onChange={handleChange}/>
                
                <TextField variant="outlined" label="Fair Market Value" id="FairMarketValue" value={formData.FairMarketValue} step="0.01" required onChange={handleChange}/>

                <Button variant="contained" type="submit" value="Submit"/>
            </form>
            </CardContent>
            </Card>
            </Grid>
            </>
          )
}

export default AddItem;