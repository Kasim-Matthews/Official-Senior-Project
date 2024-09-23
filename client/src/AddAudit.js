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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

function AddAudit() {

    const [inventory, setInventory] = useState([])
    const date = new Date().toJSON().slice(0, 10)
    const navigate = useNavigate();

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
        try {
            const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/audit/log`, { date: date, Audits: inventory });

            if (response.status == 400) {
                alert("Check the values you input. One of the values are not of the correct type.")
            }

            else if (response.status == 200) {
                window.location.href = `/audit`;
            }
        }

        catch (error) {
            alert("Server side error/Contact developer")
        }
    }

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/audit/inventory`).then((response) => {
            if (response.data.status === 'complete') {
                setInventory(response.data.data)
            }
            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query")
                console.error(response.data.message)
            }

        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        })
    }, [])


    return (
        <div>
            <Navbar />
            <Grid container justifyContent="center" >
            <Card 
            sx={{ marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}
            display="flex"
          alignItems="center"
          justifyContent="center">
                <CardContent>
                    <h2>Add Audit</h2>
            <form onSubmit={handleSubmit}>
                {inventory.map((val, index) => {
                    return(
                        <div display="flex">
                            <h4>{val.Item} + {val.Location}</h4>
                            <input type="Number" name="Changed" defaultValue={val.Past} min="0" onChange={(e) => handleChange(e, index)}/>
                        </div>
                    )
                })}

                <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit}>Submit</Button>
                <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
        </div>
    )
}

export default AddAudit;