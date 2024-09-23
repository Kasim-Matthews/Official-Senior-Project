
import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ItemInput from "./components/ItemInput";
import Distribution from "./models/Distribution";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Pagination from "./components/Pagination";
import OrderPosts from "./components/OrderPosts";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import './Order.css'; import { DateRangePicker } from 'react-date-range'
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
    let ild = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/distribution/validation`, { Items: items, Location_id: formData.Location });
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
    }
  }


  const handleSubmit = async () => {
    try {
      const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/distribution/new`, { Comments: formData.Comments, Status: formData.status, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner, Items: items, Location_id: formData.Location }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });


      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/distribution"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }

  }

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/partner/list`).then((response) => {
      if (response.data.status === 'complete') {
        setPartners(response.data.data);
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





  // return (
  //   <form id="distribution" onSubmit={validate}>
  //     <label htmlFor="Partner">Partner</label>
  //     <select id="Partner" name="Partner" value={formData.Partner} onChange={handleChange}>
  //       <option value="">--Please choose an option--</option>
  //       {partners.map((val) => {
  //         return (
  //           <option value={val.Partner_id}>{val.Name}</option>
  //         )
  //       })}

  //     </select><br />

  //     <label htmlFor="Location">Location</label>
  //     <select id="Location" name="Location" value={formData.Location} onChange={handleChange}>
  //       <option value="">--Please choose an option--</option>
  //       {locations.map((val) => {
  //         return (
  //           <option value={val.Location_id}>{val.Name}</option>
  //         )
  //       })}

  //     </select><br />
  //     <label htmlFor="RequestDate">RequestDate</label>
  //     <input type="date" name="RequestDate" id="RequestDate" value={formData.RequestDate} required onChange={handleChange} />

  //     <label htmlFor="CompletedDate">CompleteDate</label>
  //     <input type="date" name="CompletedDate" id="CompletedDate" value={formData.CompletedDate} min={formData.RequestDate} required onChange={handleChange} />




  //     <h3>Delivery Method</h3>

  //     <label htmlFor="Drop-off">Drop Off</label>
  //     <input type="radio" id="Drop-off" name="DeliveryMethod" value="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange} />
  //     <label htmlFor="Pick-up">Pick-up</label>
  //     <input type="radio" id="Pick-up" name="DeliveryMethod" value="Pick-up" checked={formData.DeliveryMethod === "Pick-up"} onChange={handleChange} />
  //     <label htmlFor="Shipped">Shipped</label>
  //     <input type="radio" id="Shipped" name="DeliveryMethod" value="Shipped" checked={formData.DeliveryMethod === "Shipped"} onChange={handleChange} />

  //     <textarea name="Comments" rows="4" cols="50" onChange={handleChange} placeholder="Comments"></textarea>
  //     {formErrors.Comments ? <p>{formErrors.Comments}</p> : null}

  //     <h2>Items</h2>
  //     {items.map((obj, index) => (
  //       <ItemInput
  //         key={index}
  //         objName={obj.name}
  //         handleItem={handleItem}
  //         handleQuantity={handleQuantity}
  //         index={index}
  //         deleteField={handleDeleteField}
  //       />
  //     ))}
  //     <button name="add-btn" onClick={handleAddField}>
  //       Add
  //     </button>

  //     <input type="submit" value="Submit" />
  //     <button type="button" onClick={handleCancel}>Cancel</button>
  //   </form>
  // )

  return (
    <div className="dashboard-container">
      <Navbar />
      <Grid container justifyContent="center" >
        <Card
          sx={{ marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <CardContent>
            <h2>Add Order</h2>
            <form id="distribution" onSubmit={validate}>
              <div display="flex" style={{ paddingBottom: "10px" }}>
                <FormControl size="small" sx={{ paddingRight: "20px" }}>
                  <InputLabel id="partner">Partner</InputLabel>
                  <NativeSelect
                    placeholder="Partner"
                    inputProps={{
                      name: 'partner',
                      id: 'partner',
                    }} id="Partner" name="Partner" value={formData.Partner} onChange={handleChange}>
                    <option disabled selected></option>
                    {partners.map((val) => {
                      return (
                        <option value={val.Partner_id}>{val.Name}</option>
                      )
                    })}
                  </NativeSelect>
                </FormControl>
                <FormControl size="small" sx={{ paddingRight: "20px" }}>
                  <InputLabel id="location">Locations</InputLabel>
                  <NativeSelect
                    placeholder="Locations"
                    inputProps={{
                      name: 'location',
                      id: 'location',
                    }} id="Location" name="Location" value={formData.Location} onChange={handleChange}>
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
                <div className='requestDate' style={{ paddingRight: "10px", paddingBottom: "10px" }}>
                  <label htmlFor="Request_date" style={{ paddingRight: "16px" }}>Request date</label>
                  <input type="date" name="Request_date" id="Request_date" value={formData.RequestDate} required onChange={handleChange} />
                </div>
                <div className='completeDate'>
                  <label htmlFor="CompletedDate" style={{ paddingRight: "5px" }}>Complete date</label>
                  <input type="date" name="CompletedDate" id="CompletedDate" value={formData.CompletedDate} required onChange={handleChange} />
                </div>
              </div>
              <div display="flex">
                <div className='delivery'>
                  <FormControl sx={{ paddingRight: "10px" }}>
                    <FormLabel id="delivery-method">Please select a delivery method</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="delivery-method-label"
                      name="delivery-method-group"
                    >
                      <FormControlLabel value="drop-off" control={<Radio />} label="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange} />
                      <FormControlLabel value="Pick-up" control={<Radio />} label="Pick-up" checked={formData.DeliveryMethod === "Pick-up"} onChange={handleChange} />
                      <FormControlLabel value="Shipped" control={<Radio />} label="Shipped" checked={formData.DeliveryMethod === "Shipped"} onChange={handleChange} />
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
                  sx={{ paddingRight: "10px" }}
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
                  sx={{ paddingRight: "20px" }}
                />
              ))}
              <Button variant="outlinted" name="add-btn" onClick={handleAddField} sx={{ paddingRight: "10px" }}>
                Add
              </Button>

              <Button variant="contained" type="submit" value="Submit" sx={{ paddingRight: "10px" }}>Submit</Button>
              <Button variant="outlined" onClick={handleCancel} sx={{ paddingRight: "10px" }}>Cancel</Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  )
}


export default AddOrder;