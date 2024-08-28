import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


function EditPurchase() {
    const { id } = useParams();
    const [formData, setFormData] = useState([])
    const [vendor, setVendors] = React.useState([])
    const [locations, setLocations] = React.useState([])
    const [formErrors, setFormErrors] = useState({})

    const [index, setIndex] = React.useState(0);
    const [items, setItems] = React.useState([])


    function handleCancel() {
        if (window.confirm("Are you sure you want to cancel") == true) {
            window.location.href = "/purchase";
        }
    }

    function handleChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleItem = (e, index) => {
        const values = [...items];
        values[index].Item_id = e.target.value;
        setItems(values)
    }

    const handleQuantity = (e, index) => {
        const values = [...items];
        values[index].Quantity = e.target.value;
        setItems(values)
    }

    const handleAddField = (e) => {
        e.preventDefault();
        setIndex(index + 1);
        const values = [...items];
        if (values.length === 0) {
            values.push(
                {
                    name: `item [${0}]`,
                    Item_id: 0,
                    Quantity: 0,
                }
            );
        }
        else {
            values.push(
                {
                    name: `item [${index}]`,
                    Item_id: 0,
                    Quantity: 0,
                }
            );
        }

        setItems(values);
    }

    const handleDeleteField = (e, index) => {
        const values = [...items];
        values.splice(index, 1);
        setItems(values);
    };

    useEffect(() => {
        Axios.get("http://localhost:3001/vendor/list").then((response) => {
            setVendors(response.data);
        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3001/location/use").then((response) => {
            setLocations(response.data);
        })
    }, [])

    useEffect(() => {
        Axios.get(`http://localhost:3001/purchase/${id}/edit`).then((response) => {
            setFormData(response.data[0]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        Axios.get(`http://localhost:3001/purchase/${id}/edititems`).then((response) => {
            setItems(response.data);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const validate = (e) => {
        e.preventDefault();
        const errors = {};
        const regex_comments = /^(?!.*SELECT|.*FROM|.*WHERE|.*UPDATE|.*INSERT).*$/;
    
    
        if (!regex_comments.test(formData.Comments)) {
          errors.Comments = "The comments contains an SQL keyword !"
        }
        setFormErrors(errors)
        if (!errors.Comments) {
            handleSubmit()
        }
        return;
    }

   
    const handleSubmit = async () => {


        let GetData = async function (id) {
            return await Axios.get(`http://localhost:3001/purchase/${id}/cleanup`).then((response) => {
                return response
            });
        }
        let data = GetData(id)
        data.then(async (response) => {
            await Axios.put("http://localhost:3001/purchase/reclaim", { records: response.data })
        })


        await Axios.delete(`http://localhost:3001/purchase/${id}/edit_delete`)

        await Axios.put(`http://localhost:3001/purchase/${id}/update`, { Comments: formData.Comments, RecievedDate: formData.PurchaseDate, Partner: formData.Vendor, Value: parseFloat(formData.TotalValue)}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        let IL_response = await Axios.post("http://localhost:3001/purchase/location", { Items: items, Location_id: formData.Location })
        await Axios.post("http://localhost:3001/purchase/track", { Intake_id: id, Items: items, Total: parseFloat(formData.TotalValue), FKItemLocation: IL_response.data });
        await Axios.put("http://localhost:3001/purchase/update_item", { Items: items, ItemLocationFK: IL_response.data});
        window.location.href = "/purchase";
    }

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
            <h2>Edit Purchase</h2>
            <form onSubmit={validate}>
            <div display="flex" padding="10px">
            <FormControl size="small" sx={{padding:"10px"}}>
            <InputLabel id="vendor">Vendor</InputLabel>
            <NativeSelect
              placeholder="Vendor"
              inputProps={{
                name: 'vendor',
                id: 'vendor',
              }}>
                 {vendor.map((val) => {
                        if (val.Partner_id == formData.Vendor) {

                            return (
                                <option value={val.Partner_id} selected>{val.Name}</option>
                            )
                        }
                        else {
                            return (
                                <option value={val.Partner_id}>{val.Name}</option>
                            )
                        }
                    })}
            </NativeSelect>
          </FormControl>
                <br />

                <FormControl size="small" sx={{padding:"10px"}}>
                    <InputLabel id="location">Location</InputLabel>
                    <NativeSelect
                    placeholder="Location"
                    inputProps={{
                        name: 'location',
                        id: 'location',
                    }}>
                        {locations.map((val) => {
                        if (val.Location_id == formData.Location) {

                            return (
                                <option value={val.Location_id} selected>{val.Name}</option>
                            )
                        }
                        else {
                            return (
                                <option value={val.Location_id}>{val.Name}</option>
                            )
                        }
                    })}
                    </NativeSelect>
                </FormControl>
                    <br />

                <div style={{padding:"10px"}}>
                    <label htmlFor="Purchase_date" style={{padding:"5px"}}>Purchase date</label>
                    <input type="date" name="Purchase_date" id="Purchase_date" defaultValue={formData.PurchaseDate} onChange={handleChange} />
        
                    <label htmlFor="TotalValue" style={{padding:"5px"}}>Purchase Total</label>
                    <input type="number" name="TotalValue" id="TotalValue" defaultValue={formData.TotalValue} min="0.00" step="0.01" onChange={handleChange} />
                </div>

                <TextField
                    id="outlined-Comments-static"
                    label="Comments"
                    multiline
                    rows={4}
                    defaultValue={formData.Comments}
                    onChange={handleChange} 
                    placeholder="Comments"
                    />{formErrors.Comments ? <p>{formErrors.Comments}</p> : null}

                <h2>Items</h2>
                {items.map((record, index) => (
                    <EditItemInput
                        key={index}
                        handleItem={handleItem}
                        handleQuantity={handleQuantity}
                        index={index}
                        record={record}
                        deleteField={handleDeleteField}
                        sx={{padding:"10px"}}
                    />
                ))}
                <Button variant="outlined" name="add-btn" onClick={handleAddField} sx={{padding:"10px"}}>
                    Add
                </Button>

                </div>
                <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit} sx={{padding:"10px"}}>Submit</Button>
                <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
        </div>
    )
}

export default EditPurchase;