import React, { useEffect } from "react";
import Axios from 'axios';
import {useParams} from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

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
            Axios.get(`http://localhost:3306/location/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setFormData(key)});
            })
          }, [])

          

          function handleSubmit(e){
            e.preventDefault();
            
            Axios.put(`http://localhost:3306/location/${id}/update`, {name:formData.Name,
            Address:formData.Address},{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
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
            <h2>Edit Location</h2>
            <form id="edit location Form" onSubmit={handleSubmit}>
                <TextField variant="outlined" label="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange}/>

                <TextField variant="outlined" label="Address" defaultValue={formData.Address} id="Address" required onChange={handleChange}/>
    
                <Button variant="contained" type="submit" value="Submit"/>
            </form>
            </CardContent>
            </Card>
            </Grid>
            </>
          )
}

export default EditLocation;