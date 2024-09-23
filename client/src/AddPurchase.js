import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Purchase from "./models/Purchase";
import ItemInput from "./components/ItemInput";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/vendor/list`).then((response) => {
            if (response.data.status === 'complete') {
                setVendors(response.data.data);
            }

            else if (response.data.status === 'error in query') {
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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/location/use`).then((response) => {
            if (response.data.status === 'complete') {
                setLocations(response.data.data);
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
        try {
            const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/purchase/new`, { Comments: formData.Comments, Purchase_date: formData.Purchase_date, Total: formData.Total, Vendor: formData.Vendor, Items: items, Location_id: formData.Location });
            if (response.status == 400) {
                alert("Check the values you input. One of the values are not of the correct type.")
            }

            else if (response.status == 200) {
                window.location.href = "/purchase";
            }
        }

        catch (error) {
            alert("Server side error/Contact developer")
        }

    }

    // return (
    //     <div>
    //         <h2>Purchase</h2>
    //         <form onSubmit={validate}>
    //             <label htmlFor="Vendor">Vendor</label>
    //             <select id="Vendor" name="Vendor" value={formData.Vendor} onChange={handleChange}>
    //                 <option value="">--Please choose an option--</option>
    //                 {vendor.map((val) => {
    //                     return (
    //                         <option value={val.Partner_id}>{val.Name}</option>
    //                     )
    //                 })}
    //             </select>
    //             <br />

    //             <label htmlFor="Location">Location</label>
    //             <select id="Location" name="Location" value={formData.Location} onChange={handleChange}>
    //                 <option value="">--Please choose an option--</option>
    //                 {locations.map((val) => {
    //                     return (
    //                         <option value={val.Location_id}>{val.Name}</option>
    //                     )
    //                 })}

    //             </select><br />

    //             <div>
    //                 <label htmlFor="Purchase_date">Purchase date</label>
    //                 <input type="date" name="Purchase_date" id="Purchase_date" value={formData.Purchase_date} onChange={handleChange} />
    //             </div>

    //             <div>
    //                 <label htmlFor="Total">Purchase Total</label>
    //                 <input type="number" name="Total" id="Total" value={formData.Total} min="0.00" step="0.01" onChange={handleChange} />
    //             </div>

    //             <div>
    //                 <label htmlFor="Comments">Comments</label><br />
    //                 <textarea name="Comments" rows="4" cols="50" value={formData.Comments} onChange={handleChange} placeholder="Comments"></textarea><br />
    //                 {formErrors.Comments ? <p>{formErrors.Comments}</p> : null}
    //             </div>

    //             <h2>Items</h2>
    //             {items.map((obj, index) => (
    //                 <ItemInput
    //                     key={index}
    //                     objName={obj.name}
    //                     handleItem={handleItem}
    //                     handleQuantity={handleQuantity}
    //                     index={index}
    //                     deleteField={handleDeleteField}
    //                 />
    //             ))}
    //             <button name="add-btn" onClick={handleAddField}>
    //                 Add
    //             </button>


    //             <input type="submit" value="Submit" />
    //             <button type="button" onClick={handleCancel}>Cancel</button>
    //         </form>
    //     </div>
    // )

    return (
        <div>
            <Navbar />
            <Grid container justifyContent="center" >
            <Card 
            sx={{ marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <CardContent>
            <h2>Add Purchase</h2>
            <form onSubmit={validate}>
            <div display="flex" padding="10px">
            <FormControl size="small">
            <InputLabel id="vendor">Vendor</InputLabel>
            <NativeSelect
              placeholder="Vendor"
              inputProps={{
                name: 'vendor',
                id: 'vendor',
              }} id="Vendor" name="Vendor" value={formData.Vendor} onChange={handleChange}>
              <option disabled selected></option>
              {vendor.map((val) => {
                        return (
                            <option value={val.Partner_id}>{val.Name}</option>
                        )
                    })}
            </NativeSelect>
          </FormControl>
                <br />

                <FormControl size="small" sx={{paddingRight:"20px"}}>
                    <InputLabel id="location">Locations</InputLabel>
                    <NativeSelect
                    placeholder="Locations"
                    inputProps={{
                        name: 'location',
                        id: 'location',
                    }} id="Location" name="Location" value={formData.Location} onChange={handleChange}>
                    <option disabled selected></option>
                    {locations.map((val) => {
                        return (
                        <option value={val.Location_id}>{val.Name}</option>
                        )
                    })}
                    </NativeSelect>
                </FormControl>
                </div>
                <div display="flex" >
                    <label htmlFor="Purchase_date">Purchase date</label>
                    <input type="date" name="Purchase_date" id="Purchase_date" value={formData.Purchase_date} onChange={handleChange} style={{paddingRight:"10px", paddingBottom: "10px"}}/>
                
                    <label htmlFor="Total">Purchase Total</label>
                    <input type="number" name="Total" id="Total" value={formData.Total} min="0.00" step="0.01" onChange={handleChange} style={{paddingRight:"10px"}}/>
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
                    sx={{paddingRight:"10px"}}
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
                        sx={{paddingRight:"20px"}}
                    />
                ))}
                <Button variant='outline' name="add-btn" onClick={handleAddField} sx={{paddingRight:"10px"}}>
                    Add
                </Button>


                <Button variant="contained" type="submit" value="Submit" sx={{paddingRight:"10px"}}>Submit</Button>
                <Button variant="outlined" type="button" onClick={handleCancel} sx={{paddingRight:"10px"}}>Cancel</Button>
            </form>
            </CardContent>
            </Card>
            </Grid>
        </div>
    )
}

export default AddPurchase;