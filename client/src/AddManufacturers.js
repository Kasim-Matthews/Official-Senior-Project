import React from "react";
import Axios from 'axios';
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

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
                Axios.post("http://localhost:3306/manufacturers/new", {name:formData.Name,},{
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
            <>
            <Navbar/>
            <Grid container justifyContent="center" >
            <Card 
            sx={{ marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <CardContent>
              <h2>Add Manufacturer</h2>
            <form id="locations" onSubmit={handleSubmit}>
                <TextField variant="outlined" label="Name" value={formData.Name} id="Name" required onChange={handleChange} sx={{paddingRight:"10px"}}/>
                <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit} sx={{paddingRight:"10px"}}>Submit</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
            </>
          )
}

export default AddManufacturers;