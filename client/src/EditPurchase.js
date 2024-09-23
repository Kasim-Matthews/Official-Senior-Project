import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function EditPurchase() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState([])
    const [vendor, setVendors] = React.useState([])
    const [locations, setLocations] = React.useState([])
    const [formErrors, setFormErrors] = useState({})

    const [index, setIndex] = React.useState(0);
    const [items, setItems] = React.useState([])

    function handleChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleCancel() {
        if (window.confirm("Are you sure you want to cancel") == true) {
            window.location.href = "/purchase";
        }
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
                console.error("Fail in the query")
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

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/purchase/${id}/edit`).then((response) => {
            if (response.data.status === 'complete') {
                setFormData(response.data.data[0]);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/purchase/${id}/edititems`).then((response) => {
            if (response.data.status === 'complete') {
                setItems(response.data.data);
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
        try {
            const response = await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/purchase/${id}/update`, { Comments: formData.Comments, RecievedDate: formData.PurchaseDate, Partner: formData.Vendor, Value: parseFloat(formData.TotalValue), Items: items, Location_id: formData.Location }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });


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
    //                     if (val.Partner_id == formData.Vendor) {

    //                         return (
    //                             <option value={val.Partner_id} selected>{val.Name}</option>
    //                         )
    //                     }
    //                     else {
    //                         return (
    //                             <option value={val.Partner_id}>{val.Name}</option>
    //                         )
    //                     }
    //                 })}
    //             </select>
    //             <br />

    //             <label htmlFor="Location">Location</label>
    //             <select id="Location" name="Location" value={formData.Location} onChange={handleChange}>
    //                 <option value="">--Please choose an option--</option>
    //                 {locations.map((val) => {
    //                     if (val.Location_id == formData.Location) {

    //                         return (
    //                             <option value={val.Location_id} selected>{val.Name}</option>
    //                         )
    //                     }
    //                     else {
    //                         return (
    //                             <option value={val.Location_id}>{val.Name}</option>
    //                         )
    //                     }
    //                 })}

    //             </select><br />

    //             <div>
    //                 <label htmlFor="Purchase_date">Purchase date</label>
    //                 <input type="date" name="Purchase_date" id="Purchase_date" defaultValue={formData.PurchaseDate} onChange={handleChange} />
    //             </div>

    //             <div>
    //                 <label htmlFor="TotalValue">Purchase Total</label>
    //                 <input type="number" name="TotalValue" id="TotalValue" defaultValue={formData.TotalValue} min="0.00" step="0.01" onChange={handleChange} />
    //             </div>

    //             <div>
    //                 <label htmlFor="Comments">Comments</label><br />
    //                 <textarea name="Comments" rows="4" cols="50" defaultValue={formData.Comments} onChange={handleChange} placeholder="Comments"></textarea><br />
    //                 {formErrors.Comments ? <p>{formErrors.Comments}</p> : null}
    //             </div>

    //             <h2>Items</h2>
    //             {items.map((record, index) => (
    //                 <EditItemInput
    //                     key={index}
    //                     handleItem={handleItem}
    //                     handleQuantity={handleQuantity}
    //                     index={index}
    //                     record={record}
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
                    sx={{ paddingtop: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <CardContent>
                        <h2>Edit Purchase</h2>
                        <form onSubmit={validate}>
                            <div display="flex" padding="10px">
                                <FormControl size="small" sx={{ padding: "10px" }}>
                                    <InputLabel id="vendor">Vendor</InputLabel>
                                    <NativeSelect
                                        placeholder="Vendor"
                                        inputProps={{
                                            name: 'vendor',
                                            id: 'vendor',
                                        }} id="Vendor" name="Vendor" value={formData.Vendor} onChange={handleChange}>
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

                                <FormControl size="small" sx={{ padding: "10px" }}>
                                    <InputLabel id="location">Location</InputLabel>
                                    <NativeSelect
                                        placeholder="Location"
                                        inputProps={{
                                            name: 'location',
                                            id: 'location',
                                        }} id="Location" name="Location" value={formData.Location} onChange={handleChange}>
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

                                <div style={{ padding: "10px" }}>
                                    <label htmlFor="Purchase_date" style={{ padding: "5px" }}>Purchase date</label>
                                    <input type="date" name="Purchase_date" id="Purchase_date" defaultValue={formData.PurchaseDate} onChange={handleChange} />

                                    <label htmlFor="TotalValue" style={{ padding: "5px" }}>Purchase Total</label>
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
                                        sx={{ padding: "10px" }}
                                    />
                                ))}
                                <Button variant="outlined" name="add-btn" onClick={handleAddField} sx={{ padding: "10px" }}>
                                    Add
                                </Button>

                            </div>
                            <Button variant="contained" type="submit" value="Submit" sx={{ padding: "10px" }}>Submit</Button>
                            <Button variant="outlined" type="button" onClick={handleCancel}>Cancel</Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    )
}

export default EditPurchase;