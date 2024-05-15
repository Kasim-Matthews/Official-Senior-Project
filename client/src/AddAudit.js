import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';



function AddAudit() {

    const [inventory, setInventory] = useState([])
    const date = new Date().toJSON().slice(0, 10)

    function handleChange(e, index) {
        const values = [...inventory]
        values[index].Changed = e.target.value
        setInventory(values);
      }

      function handleCancel() {
        if (window.confirm("Are you sure you want to cancel") == true) {
            window.location.href = "/audit";
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        await Axios.post("http://localhost:3001/audit/log", {date: date});
        await Axios.post("http://localhost:3001/audit/new", {Audits: inventory});
        await Axios.put("http://localhost:3001/audit/update", {Audits: inventory});
        window.location.href = `/audit`;
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/audit/inventory").then((response) => {
            setInventory(response.data)
        })
    }, [])


    return (
        <div>
            <Navbar />
            <Grid container justifyContent="center" >
            <Card 
            sx={{ minWidth: 275 }}
            display="flex"
          alignItems="center"
          justifyContent="center">
                <CardContent>
                    <h2>Add Audit</h2>
            <form onSubmit={handleSubmit}>
                {inventory.map((val, index) => {
                    return(
                        <div>
                            <h4>{val.Item} + {val.Location}</h4>
                            <input type="Number" name="Changed" defaultValue={val.Past} min="0" onChange={(e) => handleChange(e, index)}/>
                        </div>
                    )
                })}

                <Button variant="contained" type="submit" value="Submit" />
                <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
        </div>
    )
}

export default AddAudit;