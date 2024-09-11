import React, { useEffect } from "react";
import Axios from 'axios';
import {useParams} from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function EditManufacturers(){
    
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
            Axios.get(`http://localhost:3306/manufacturers/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setFormData(key)});
            })
          }, [])

          

          function handleSubmit(e){
            e.preventDefault();
            
            Axios.put(`http://localhost:3306/manufacturers/${id}/update`, {name:formData.Name,},{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
            window.location.href = "/manufacturers";
      
          }
          return(
            <>
            <Navbar />
            <Grid container justifyContent="center" >
          <Card 
          sx={{ paddingtop: "50px", display: "flex", alignItems: "center", justifyContent: "center" }} 
          >
          <CardContent>
            <h2>Edit Manufacturer</h2>
            <form id="edit location Form" onSubmit={handleSubmit}>
                <TextField variant="outlined" label="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange} sx={{padding:"10px"}}/>
                <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit}>Submit</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
          </>
          )
}

export default EditManufacturers;