import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ItemInput from "./components/ItemInput";
import Distribution from "./models/Distribution";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Pagination from "./components/Pagination";
import OrderPosts from "./components/OrderPosts";
import  Box  from '@mui/material/Box';
import  AppBar  from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import  IconButton  from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import './Order.css';import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Stack from '@mui/material/Stack';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';

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
    <form id="distribution" onSubmit={validate}>
          <div className='partner'>
            <TextField
              id="outlined-select-partner"
              select
              label="Partner"
              defaultValue="Partner"
              helperText="Please select a partner"
              value={formData.Partner} 
              onChange={handleChange}
            >
              {partners.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            </div>
          <div className='location'>
            <TextField
              id="outlined-select-location"
              select
              label="Location"
              defaultValue="Location"
              helperText="Please select a location"
              value={formData.Location} 
              onChange={handleChange}
            >
              {locations.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            </div>
            <div className='requestDate'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="Request Date" value={formData.RequestDate}  min="2023-09-01" required onChange={handleChange}/>
              </DemoContainer>
            </LocalizationProvider>
            </div> 
            <div className='completeDate'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="Complete Date" value={formData.CompletedDate} min={formData.RequestDate} required onChange={handleChange}/>
              </DemoContainer>
            </LocalizationProvider>
            </div> 
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
    </div>
  )
}

export default AddOrder;