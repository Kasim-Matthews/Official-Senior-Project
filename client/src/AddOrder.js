import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ItemInput from "./components/ItemInput";
import Distribution from "./models/Distribution";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Pagination from "./components/Pagination";
import OrderPosts from "./components/OrderPosts";
import  AppBar  from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import  IconButton  from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import './Order.css';import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


function AddOrder() {
  const navigate = useNavigate();
  const [partners, setPartners] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const [formData, setFormData] = React.useState(Distribution)
  const [formErrors, setFormErrors] = useState({})

  const [index, setIndex] = React.useState(1);

  const [items, setItems] = React.useState([
    {
      name: `item [${index}]`,
      Item_id: 0,
      Quantity: 0,

    }
  ])

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


  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
      window.location.href = "/distribution";
    }
  }

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
    let ild = await Axios.post("http://localhost:3001/distribution/validation", { Items: items, Location_id: formData.Location });
    var result = []
    for (let o1 of ild.data) {
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
    }
  }


  const handleSubmit = async () => {

    try {
      Axios.post("http://localhost:3306/distribution/new", { Comments: formData.Comments, Status: formData.status, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner, Items: items, Location_id: formData.Location }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      window.location.href = "/distribution";
    }
    catch (error) {
      navigate('/query')
      console.error(error)
    }

  }

  useEffect(() => {
    Axios.get("http://localhost:3001/partner/list").then((response) => {
      setPartners(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3001/location/use").then((response) => {
      setLocations(response.data);
    })
  }, [])





  return (
    <div className="dashboard-container">
    <Navbar />
    <Grid container justifyContent="center" >
    <Card 
    sx={{ minWidth: 275 }}
    display="flex"
          alignItems="center"
          justifyContent="center">
      <CardContent>
        <h2>Add Order</h2>
    <form id="distribution" onSubmit={validate}>
      <div display="flex" style={{paddingBottom:"10px"}}>
          <FormControl size="small" sx={{paddingRight:"20px"}}>
            <InputLabel id="partner">Partner</InputLabel>
            <NativeSelect
              placeholder="Partner"
              inputProps={{
                name: 'partner',
                id: 'partner',
              }}>
              <option disabled selected></option>
              {partners.map((val) => {
                return (
                  <option value={val.Partner_id}>{val.Name}</option>
                )
              })}
            </NativeSelect>
          </FormControl>
          <FormControl size="small">
            <InputLabel id="location">Locations</InputLabel>
            <NativeSelect
              placeholder="Locations"
              inputProps={{
                name: 'location',
                id: 'location',
              }}>
              <option disabled selected></option>
              {locations.map((val) => {
                return (
                  <option value={val.Location_id}>{val.Name}</option>
                )
              })}
            </NativeSelect>
          </FormControl>
          </div>
          <div display="flex">
            <div className='requestDate'>
              <label htmlFor="Request_date">Request date</label>
                    <input type="date" name="Request_date" id="Request_date" value={formData.RequestDate} required onChange={handleChange} />
            </div> 
            <div className='completeDate'>
              <label htmlFor="Complete_date">Complete date</label>
                    <input type="date" name="Complete_date" id="Complete_date" value={formData.Complete_date} required onChange={handleChange} />
            </div> 
            </div>
            <div display="flex">
            <div className='delivery'>
            <FormControl>
              <FormLabel id="delivery-method">Please select a delivery method</FormLabel>
              <RadioGroup
                row
                aria-labelledby="delivery-method-label"
                name="delivery-method-group"
              >
                <FormControlLabel value="drop-off" control={<Radio />} label="Drop-off"  checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange}/>
                <FormControlLabel value="other" control={<Radio />} label="Other"  checked={formData.DeliveryMethod === "Other"} onChange={handleChange}/>
              </RadioGroup>
            </FormControl>
            </div>
            <TextField
              id="outlined-Comments-static"
              label="Comments"
              multiline
              rows={4}
              defaultValue="Comments"
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
      <button name="add-btn" onClick={handleAddField}>
        Add
      </button>

      <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit}>Submit</Button>
      <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
    </form>
    </CardContent>
    </Card>
    </Grid>
    </div>
  )
}

export default AddOrder;