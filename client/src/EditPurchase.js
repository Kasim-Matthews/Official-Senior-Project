import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";

function EditPurchase() {
    const { id } = useParams();
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
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/vendor/list").then((response) => {
            setVendors(response.data.data);
        })
    }, [])

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/location/use").then((response) => {
            setLocations(response.data.data);
        })
    }, [])

    useEffect(() => {
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/purchase/${id}/edit`).then((response) => {
            setFormData(response.data.data[0]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/purchase/${id}/edititems`).then((response) => {
            setItems(response.data.data);
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
            return await Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/purchase/${id}/cleanup`).then((response) => {
                return response
            });
        }
        let data = GetData(id)
        data.then(async (response) => {
            await Axios.put("https://diaper-bank-inventory-management-system.onrender.com/purchase/reclaim", { records: response.data })
        })


        await Axios.delete(`https://diaper-bank-inventory-management-system.onrender.com/purchase/${id}/edit_delete`)

        await Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/purchase/${id}/update`, { Comments: formData.Comments, RecievedDate: formData.PurchaseDate, Partner: formData.Vendor, Value: parseFloat(formData.TotalValue), Items: items, Location_id: formData.Location}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        let IL_response = await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/purchase/location", { Items: items, Location_id: formData.Location })
        await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/purchase/track", { Intake_id: id, Items: items, Total: parseFloat(formData.TotalValue), FKItemLocation: IL_response.data });
        await Axios.put("https://diaper-bank-inventory-management-system.onrender.com/purchase/update_item", { Items: items, ItemLocationFK: IL_response.data});
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
                </select>
                <br />

                <label htmlFor="Location">Location</label>
                <select id="Location" name="Location" value={formData.Location} onChange={handleChange}>
                    <option value="">--Please choose an option--</option>
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

                </select><br />

                <div>
                    <label htmlFor="Purchase_date">Purchase date</label>
                    <input type="date" name="Purchase_date" id="Purchase_date" defaultValue={formData.PurchaseDate} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="TotalValue">Purchase Total</label>
                    <input type="number" name="TotalValue" id="TotalValue" defaultValue={formData.TotalValue} min="0.00" step="0.01" onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="Comments">Comments</label><br />
                    <textarea name="Comments" rows="4" cols="50" defaultValue={formData.Comments} onChange={handleChange} placeholder="Comments"></textarea><br />
                    {formErrors.Comments ? <p>{formErrors.Comments}</p> : null}
                </div>

                <h2>Items</h2>
                {items.map((record, index) => (
                    <EditItemInput
                        key={index}
                        handleItem={handleItem}
                        handleQuantity={handleQuantity}
                        index={index}
                        record={record}
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

export default EditPurchase;