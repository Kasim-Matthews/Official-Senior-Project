import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";

function EditPurchase() {
    const { id } = useParams();
    const [formData, setFormData] = useState([])
    const [vendor, setVendors] = React.useState([])
    const [locations, setLocations] = React.useState([])

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
        Axios.get("http://localhost:3001/vendor/list").then((response) => {
            setVendors(response.data);
        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3001/location").then((response) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log(parseFloat(formData.TotalValue))
        console.log(items)

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


        for (const item of items) {
            let IL_response = await Axios.post("http://localhost:3001/purchase/location", { Item_id: item.Item, Location_id: String(formData.Location) })

            await Axios.post("http://localhost:3001/purchase/track", { Intake_id: id, Quantity: item.Quantity, Total: parseFloat(formData.TotalValue), FKItemLocation: IL_response.data[0].ItemLocation_id });

            let current = await Axios.post("http://localhost:3001/purchase/find_q", { ItemLocationFK: IL_response.data[0].ItemLocation_id })

            await Axios.put("http://localhost:3001/purchase/update_item", { Quantity: item.Quantity, ItemLocationFK: IL_response.data[0].ItemLocation_id, CurrentQ: current.data[0].Quantity });

        }

        window.location.href = "/purchase";
    }

    return (
        <div>
            <h2>Purchase</h2>
            <form onSubmit={handleSubmit}>
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