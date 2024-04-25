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


  function handleCancel(){
    if(window.confirm("Are you sure you want to cancel") == true){
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
        handleSubmit()
    }
    return;
}


  const handleSubmit = async () => {

    Axios.post("http://localhost:3306/distribution/new", { Comments: formData.Comments, Status: formData.status, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    let IL_response = await Axios.post("http://localhost:3306/distribution/find_ild", { Items: items, Location_id: formData.Location  })
    let OID_response = await Axios.get("http://localhost:3306/distribution/find_id");
    let V_response = await Axios.post("http://localhost:3306/distribution/find_value", {Items: items })
    await Axios.post("http://localhost:3306/distribution/track", { Order_id: OID_response.data[0].Order_id, Items: items, Values: V_response.data, ItemLocationFK: IL_response.data});
    await Axios.put("http://localhost:3306/distribution/take", { Items: items, ItemLocationFK: IL_response.data});
    window.location.href = "/distribution";

  }

  useEffect(() => {
    Axios.get("http://localhost:3306/partner/list").then((response) => {
      setPartners(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3306/location/use").then((response) => {
      setLocations(response.data);
    })
  }, [])





  return (
    <div className="dashboard-container">
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ bgcolor: '#065AB0'}}>
                    <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/Dashboard" style={{ textDecoration: 'none', color: 'white' }}>{'Dashboard'}</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/distribution" style={{ textDecoration: 'none', color: 'white' }}>Distributions</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/intake" style={{ textDecoration: 'none', color: 'white' }}>Collections</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="#" style={{ textDecoration: 'none', color: 'white' }}>Inventory</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/partner" style={{ textDecoration: 'none', color: 'white' }}>Partner</Link>
                    </Typography>
                        <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                </Box>
    <form id="distribution" onSubmit={validate}>
          <div className='partner'>
            <TextField
              id="outlined-select-partner"
              select
              label="Partner"
              defaultValue="Partner"
              helperText="Please select a partner"
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
                <DatePicker label="Request Date" min="2023-09-01" required onChange={handleChange}/>
              </DemoContainer>
            </LocalizationProvider>
            </div> 
            <div className='completeDate'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="Complete Date" min={formData.RequestDate} required onChange={handleChange}/>
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
      <label htmlFor="Partner">Partner</label>
      <select id="Partner" name="Partner" value={formData.Partner} onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        {partners.map((val) => {
          return (
            <option value={val.Partner_id}>{val.Name}</option>
          )
        })}

      </select><br />

      <label htmlFor="Location">Location</label>
      <select id="Location" name="Location" value={formData.Location} onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        {locations.map((val) => {
          return (
            <option value={val.Location_id}>{val.Name}</option>
          )
        })}

      </select><br />
      <label htmlFor="RequestDate">RequestDate</label>
      <input type="date" name="RequestDate" id="RequestDate" value={formData.RequestDate} min="2023-09-01" required onChange={handleChange} />

      <label htmlFor="CompletedDate">CompleteDate</label>
      <input type="date" name="CompletedDate" id="CompletedDate" value={formData.CompletedDate} min={formData.RequestDate} required onChange={handleChange} />




      <h3>Delivery Method</h3>

      <label htmlFor="Drop-off">Drop Off</label>
      <input type="radio" id="Drop-off" name="DeliveryMethod" value="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange} />
      <label htmlFor="Other">Other</label>
      <input type="radio" id="Other" name="DeliveryMethod" value="Other" checked={formData.DeliveryMethod === "Other"} onChange={handleChange} />

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
    </div>
  )
}

export default AddOrder;