import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Purchase from "./models/Purchase";
import ItemInput from "./components/ItemInput";
import { useNavigate } from "react-router-dom";

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
        Axios.get("http://localhost:3001/vendor/list").then((response) => {
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
        await Axios.post("http://localhost:3001/purchase/new", { Comments: formData.Comments, Purchase_date: formData.Purchase_date, Total: formData.Total, Vendor: formData.Vendor })
        let IL_response = await Axios.post("http://localhost:3001/purchase/location", { Items: items, Location_id: formData.Location })
        await Axios.post("http://localhost:3001/purchase/track", { Items: items, Total: formData.Total, FKItemLocation: IL_response.data });
        await Axios.put("http://localhost:3001/purchase/update_item", { Items: items, ItemLocationFK: IL_response.data});
        window.location.href = "/purchase";


        
    }

    return (
        <div>
            <h2>Purchase</h2>
            <form onSubmit={validate}>
                <label htmlFor="Vendor">Vendor</label>
                <select id="Vendor" name="Vendor" value={formData.Vendor} onChange={handleChange}>
                    <option value="">--Please choose an option--</option>
                    {vendor.map((val) => {
                        return (
                            <option value={val.Partner_id}>{val.Name}</option>
                        )
                    })}
                </select>
                <br />

                <label htmlFor="Location">Location</label>
                <select id="Location" name="Location" value={formData.Location} onChange={handleChange}>
                    <option value="">--Please choose an option--</option>
                    {locations.map((val) => {
                        return (
                            <option value={val.Location_id}>{val.Name}</option>
                        )
                    })}

                </select><br />

                <div>
                    <label htmlFor="Purchase_date">Purchase date</label>
                    <input type="date" name="Purchase_date" id="Purchase_date" value={formData.Purchase_date} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="Total">Purchase Total</label>
                    <input type="number" name="Total" id="Total" value={formData.Total} min="0.00" step="0.01" onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="Comments">Comments</label><br />
                    <textarea name="Comments" rows="4" cols="50" value={formData.Comments} onChange={handleChange} placeholder="Comments"></textarea><br />
                    {formErrors.Comments ? <p>{formErrors.Comments}</p> : null}
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
                <button name="add-btn" onClick={handleAddField}>
                    Add
                </button>


                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default AddPurchase;