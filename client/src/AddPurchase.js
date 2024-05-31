import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Purchase from "./models/Purchase";
import ItemInput from "./components/ItemInput";
import { useNavigate } from "react-router-dom";
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


function AddPurchase() {
    const [formData, setFormData] = useState(Purchase)
    const [vendor, setVendors] = React.useState([])
    const [locations, setLocations] = React.useState([])
    const [formErrors, setFormErrors] = useState({})
    const navigate = useNavigate();

    const [index, setIndex] = React.useState(0);
    const [items, setItems] = React.useState([
        {
            name: `item [${index}]`,
            Item_id: 0,
            Quantity: 0,

        }
    ])

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
        Axios.get("http://localhost:3306/vendor/list").then((response) => {
            if (response.data.status === 'complete') {
                setVendors(response.data);
            }

            else if (response.data.status === 'error in query'){
                navigate('/query')
                console.error("Fail in the query loading vendor options for the filter")
                console.error(response.data.message)
            }
        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3001/location/use").then((response) => {
            setLocations(response.data);
        })
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
        await Axios.post("http://localhost:3306/purchase/new", { Comments: formData.Comments, Purchase_date: formData.Purchase_date, Total: formData.Total, Vendor: formData.Vendor })
        let IL_response = await Axios.post("http://localhost:3306/purchase/location", { Items: items, Location_id: formData.Location })
        await Axios.post("http://localhost:3306/purchase/track", { Items: items, Total: formData.Total, FKItemLocation: IL_response.data });
        await Axios.put("http://localhost:3306/purchase/update_item", { Items: items, ItemLocationFK: IL_response.data});
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
            <h2>Add Purchase</h2>
            <form onSubmit={validate}>
            <FormControl size="small">
            <InputLabel id="vendor">Vendor</InputLabel>
            <NativeSelect
              placeholder="Vendor"
              inputProps={{
                name: 'vendor',
                id: 'vendor',
              }}>
              {vendor.map((val) => {
                        return (
                            <option value={val.Partner_id}>{val.Name}</option>
                        )
                    })}
            </NativeSelect>
          </FormControl>
                <br />

                <FormControl size="small">
                    <InputLabel id="location">Locations</InputLabel>
                    <NativeSelect
                    placeholder="Locations"
                    inputProps={{
                        name: 'location',
                        id: 'location',
                    }}>
                    <option disabled></option>
                    {locations.map((val) => {
                        return (
                        <option value={val.Location_id}>{val.Name}</option>
                        )
                    })}
                    </NativeSelect>
                </FormControl>

                <div>
                    <label htmlFor="Purchase_date">Purchase date</label>
                    <input type="date" name="Purchase_date" id="Purchase_date" value={formData.Purchase_date} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="Total">Purchase Total</label>
                    <input type="number" name="Total" id="Total" value={formData.Total} min="0.00" step="0.01" onChange={handleChange} />
                </div>

                <div>
                <TextField
                    id="outlined-Comments-static"
                    label="Comments"
                    multiline
                    rows={4}
                    defaultValue="Comments"
                    value={formData.Comments}
                    onChange={handleChange} 
                    placeholder="Comments"
                    />{formErrors.Comments ? <p>{formErrors.Comments}</p> : null}
                </div>

                <h2>Items</h2>
                {items.map((obj, index) => (
                    <ItemInput
                        key={index}
                        objName={obj.name}
                        handleItem={handleItem}
                        handleQuantity={handleQuantity}
                        index={index}
                        deleteField={handleDeleteField}
                    />
                ))}
                <Button variant='outline' name="add-btn" onClick={handleAddField}>
                    Add
                </Button>


                <Button variant="contained" type="submit" value="Submit" />
            </form>
            </CardContent>
            </Card>
            </Grid>
        </div>
    )
}

export default AddPurchase;