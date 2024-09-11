import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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
            Axios.get(`http://localhost:3306/item/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setFormData(key)});
            })
          }, [])

          

          function handleSubmit(e){
            e.preventDefault();
            
            Axios.put(`http://localhost:3306/item/${id}/update`, {name:formData.Name,
            FairMarketValue:formData.FairMarketValue},{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
            window.location.href = "/item";
      
          }
          return(
            <>
            <Navbar />
            <Grid container justifyContent="center" >
          <Card 
          sx={{ paddingtop: "50px", display: "flex", alignItems: "center", justifyContent: "center" }} 
          >
          <CardContent>
            <h2>Edit Item</h2>
            <form id="edit item" onSubmit={handleSubmit}>
            <div display="flex" padding="10px">
                <TextField variant="outlined" label="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange} sx={{padding:"10px"}}/>

                <TextField variant="outlined" name="FairMarketValue" id="FairMarketValue" defaultValue={formData.FairMarketValue} step="0.01" required onChange={handleChange} sx={{padding:"10px"}} />
            </div>
                <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit}>Submit</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
            </>
          )
}

export default EditItem;