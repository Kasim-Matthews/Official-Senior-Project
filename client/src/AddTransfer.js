import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ItemInput from "./components/ItemInput";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';


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

    function handleCancel() {
        if (window.confirm("Are you sure you want to cancel") == true) {
            window.location.href = "/transfer";
        }
    }


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
        Axios.get("http://localhost:3001/location/use").then((response) => {
            setTo(response.data);
        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3001/transfer/adjustment").then((response) => {
            setFrom(response.data);
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

    const quantityCheck = async() => {
        let ild = await Axios.post("http://localhost:3001/transfer/validation", {Items: items, Location: formData.To});
        var result = []
        for(let o1 of ild.data){
            for(let o2 of items){
                if(o1.Item_id == o2.Item_id){
                    if(o1.Quantity < o2.Quantity){
                        result.push(o1.Item);
                    }
                }
            }
        }
        if(result.length == 0){
            handleSubmit()
            return
        }
        else{
            alert(`There is not a sufficient amount of ${result.toString()} to complete the transfer`)
            return
        }
    }


    const handleSubmit = async () => {
        await Axios.put('http://localhost:3001/transfer/give', {Location:formData.To, Items: items})
        await Axios.put('http://localhost:3001/transfer/take', {Location:formData.From.Location, Items: items})
        await Axios.post("http://localhost:3001/intake/new", { Comments: formData.Comments, RecievedDate: formData.Date, Partner: formData.From.Partner_id })
        let ild = await Axios.post("http://localhost:3001/transfer/ild", {Items: items, Location: formData.To});
        let Values = await Axios.post('http://localhost:3001/transfer/values', {Items: items});

       await Axios.post('http://localhost:3001/transfer/track', { Values: Values.data, Items: items, FKItemLocation: ild.data}).then(window.location.href = '/transfer');

    }

    return (
        <>
        <Navbar />
        <form onSubmit={validate}>
            <Textfield defaultValue="From" helperText="Please select a location" select id="From" name="From" onChange={handleFrom}/>
                {from.map((val, index) => {
                    return (
                        <option value={index}>{val.Name}</option>
                    )
                })}
            <br />

            <Textfield select defaultValue="To" helperText="Please select a location" id="To" name="To" onChange={handleChange}/>
                {to.map((val) => {
                    if(val.Location_id == formData.From.Location){
                        return(null);
                    }
                    else{
                        return (
                            <option value={val.Location_id}>{val.Name}</option>
                        )
                    }
                })}
            <br />

            <TextField
              id="outlined-Comments-static"
              label="Comments"
              multiline
              rows={4}
              defaultValue="Comments"
              onChange={handleChange} 
              placeholder="Comments"
            />{formErrors.Comments ? <p>{formErrors.Comments}</p> : null}

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
            <Button variant="outlined" name="add-btn" onClick={handleAddField}>
                Add
            </Button>

            <input type="submit" value="Submit" />
            <button onClick={handleCancel}>Cancel</button>
        </form>
        </>
    )
}

export default AddTransfer;