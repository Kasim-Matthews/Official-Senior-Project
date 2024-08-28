import React from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

function AddLocation(){
    const navigate = useNavigate();
    
    const [formData, setFormData] = React.useState(
        {
          Name: "",
          Address: "",
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
                Axios.post("http://localhost:3306/location/new", {name:formData.Name,
                Address:formData.Address},{
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
            <>
            <Navbar />
            <Grid container justifyContent="center" >
            <Card 
            sx={{ minWidth: 275 }}
            display="flex"
          alignItems="center"
          justifyContent="center">
            <CardContent>
              <h2>Add Location</h2>
            <form id="locations" onSubmit={handleSubmit}>
              <div display="flex" padding="10px">
                <TextField variant="outlined" label="Name" value={formData.Name} id="Name" required onChange={handleChange} sx={{paddingRight:"10px"}}/>

                <TextField variant="outlined" name="Address" value={formData.Address} id="Address" required onChange={handleChange} sx={{paddingRight:"10px"}}/>
                </div>
                <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit} sx={{paddingRight:"10px"}}>Submit</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
          </>
          )
}

export default AddLocation;