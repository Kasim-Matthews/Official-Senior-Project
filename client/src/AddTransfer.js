import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ItemInput from "./components/ItemInput";
import { useNavigate } from "react-router-dom";


function AddTransfer() {
    const navigate = useNavigate();
    const [from, setFrom] = React.useState([]);
    const [to, setTo] = React.useState([]);
    const [formData, setFormData] = React.useState({
        From: {},
        To: 0,
        Date: new Date().toJSON().slice(0, 10),
        Comments: ""
    })

    const [index, setIndex] = React.useState(1);

    const [items, setItems] = React.useState([
        {
            name: `item [${index}]`,
            Item_id: 0,
            Quantity: 0,

        }
    ])
    const [formErrors, setFormErrors] = useState({})

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

    function handleCancel() {
        if (window.confirm("Are you sure you want to cancel") == true) {
            window.location.href = "/transfer";
        }
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


    function handleChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleFrom(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                From: from[event.target.value]
            }
        })
    }

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/location/use").then((response) => {
            if (response.data.status === 'complete') {
                setTo(response.data.data);
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
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/transfer/adjustment").then((response) => {
            if (response.data.status === 'complete') {
                setFrom(response.data.data);
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
            quantityCheck()
        }
        return;
    }

    const quantityCheck = async () => {
        let ild = await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/transfer/validation", { Items: items, Location: formData.From.Location });
        var result = []
        for (let o1 of ild.data.data) {
            for (let o2 of items) {
                if (o1.Item_id == o2.Item_id) {
                    if (o1.Quantity < o2.Quantity) {
                        result.push(o1.Item);
                    }
                }
            }
        }
        if (result.length == 0) {
            handleSubmit()
            return
        }
        else {
            alert(`There is not a sufficient amount of ${result.toString()} to complete the transfer`)
            return
        }
    }


    const handleSubmit = async () => {
        try {
            const response = await Axios.put('https://diaper-bank-inventory-management-system.onrender.com/transfer/give', { To: formData.To, Items: items, Comments: formData.Comments, RecievedDate: formData.Date, Partner: formData.From.Partner_id, From: formData.From.Location })



            if (response.status == 400) {
                alert("Check the values you input. One of the values are not of the correct type.")
            }

            else if (response.status == 200) {
                window.location.href = "/transfer"
            }
        }

        catch (error) {
            alert("Server side error/Contact developer")
        }
    }


    return (
        <form onSubmit={validate}>
            <label htmlFor="From">From storage location</label>
            <select id="From" name="From" onChange={handleFrom}>
                <option value="">--Please choose an option--</option>
                {from.map((val, index) => {
                    return (
                        <option value={index}>{val.Name}</option>
                    )
                })}

            </select><br />

            <label htmlFor="To">To storage location</label>
            <select id="To" name="To" onChange={handleChange}>
                <option value="" >--Please choose an option--</option>
                {to.map((val) => {
                    if (val.Location_id == formData.From.Location) {
                        return (null);
                    }
                    else {
                        return (
                            <option value={val.Location_id}>{val.Name}</option>
                        )
                    }
                })}

            </select><br />

            <textarea name="Comments" rows="4" cols="50" onChange={handleChange} placeholder="Comments"></textarea>
            {formErrors.Comments ? <p>{formErrors.Comments}</p> : null}

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
            <button onClick={handleCancel}>Cancel</button>
        </form>
    )
}

export default AddTransfer;