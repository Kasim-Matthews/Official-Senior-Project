import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function EditPartner(){
    
    const navigate = useNavigate();
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
            Axios.get(`http://localhost:3306/partner/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setFormData(key)});
            })
          }, [])

          

          function handleSubmit(e){
            e.preventDefault();
            
            Axios.put(`http://localhost:3306/partner/${id}/update`, {name:formData.Name,
            email:formData.Email},{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
            window.location.href = "/partner";
      
          }
          return(
            <>
            <Navbar />
            <Grid container justifyContent="center" >
          <Card 
          sx={{ paddingtop: "50px", display: "flex", alignItems: "center", justifyContent: "center" }} 
          >
          <CardContent>
            <h2>Edit Partner</h2>
            <form id="edit partnerForm" onSubmit={handleSubmit}>
            <div display="flex" padding="10px">
              <TextField varaint="outlined" name="Name" id="Name" defaultValue={formData.Name} onChange={handleChange} required sx={{padding:"10px"}}/>

              <TextField variant="outlined" type="text" name="Email" defaultValue={formData.Email} id="Email" onChange={handleChange} required sx={{padding:"10px"}}/>
            </div>
                <Button varaint="contained" type="submit" value="Submit" onClick={handleSubmit}>Submit</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
            </>
          )
}

export default EditPartner;