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
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    )
}

export default AddPurchase;