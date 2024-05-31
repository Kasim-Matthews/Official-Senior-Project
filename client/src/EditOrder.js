import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


function EditOrder() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = React.useState([])
  const [partners, setPartners] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const [formErrors, setFormErrors] = useState({})


  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/distribution";
    }
}


  const [index, setIndex] = React.useState(0);

  const [items, setItems] = React.useState([])

  const handleItem = (e, index) => {
    const values = [...items];
    values[index].Item = e.target.value;
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
          Quantity: 0,
          Item: 0
        }
      );
    }
    else {
      values.push(
        {
          Quantity: 0,
          Item: 0
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



  useEffect(() => {
    Axios.get(`http://localhost:3001/distribution/${id}/edit`).then((response) => {
      setFormData(response.data[0]);
    })
  }, [])

  useEffect(() => {
    Axios.get(`http://localhost:3001/distribution/${id}/edititems`).then((response) => {
      setItems(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3001/partner/options").then((response) => {
      setPartners(response.data);
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
      return
    }
  }

  async function handleSubmit() {


    let GetData = async function (id) {
      return await Axios.get(`http://localhost:3001/distribution/${id}/cleanup`).then((response) => {
        return response
      });
    }

    let data = GetData(id)
    await data.then(async (response) => {
      await Axios.put("http://localhost:3001/distribution/reclaim", { records: response.data })
    })

    await Axios.delete(`http://localhost:3001/distribution/${id}/edit_delete`)

    await Axios.put(`http://localhost:3001/distribution/${id}/update`, { Comments: formData.Comments, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner_id });

    let IL_response = await Axios.post("http://localhost:3001/distribution/find_ild", { Items: items, Location_id: formData.Location  })
    let V_response = await Axios.post("http://localhost:3001/distribution/find_value", {Items: items })
    await Axios.post("http://localhost:3001/distribution/track", { Order_id: id, Items: items, Values: V_response.data, ItemLocationFK: IL_response.data});
    await Axios.put("http://localhost:3001/distribution/take", { Items: items, ItemLocationFK: IL_response.data});
    navigate('/distribution')


  }

  return (
    <>
    <Navbar/>
    <Grid container justifyContent="center" >
          <Card 
          sx={{ minWidth: 275 }} 
          display="flex"
          alignItems="center"
          justifyContent="center">
          <CardContent>
            <h2>Edit Order</h2>
    <form id="edit distribution" onSubmit={validate}>
    <FormControl size="small">
            <InputLabel id="partner">Partner</InputLabel>
            <NativeSelect
              placeholder="Partner"
              inputProps={{
                name: 'partner',
                id: 'partner',
              }}>
             {partners.map((val) => {
          if (val.value == formData.Partner_id) {

            return (
              <option value={val.value} selected>{val.label}</option>
            )
          }
          else {
            return (
              <option value={val.value}>{val.label}</option>
            )
          }
        })}
            </NativeSelect>
          </FormControl>
        <br />

        <FormControl size="small">
            <InputLabel id="location">Location</InputLabel>
            <NativeSelect
              placeholder="Location"
              inputProps={{
                name: 'location',
                id: 'location',
              }}>
             {locations.map((val) => {
          if (val.Location_id == formData.Location_id) {

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
            </NativeSelect>
          </FormControl>
          <br />

      <label htmlFor="RequestDate">RequestDate</label>
      <input type="date" name="RequestDate" id="RequestDate" defaultValue={formData.RequestDate} min="2023-09-01" required onChange={handleChange} />

      <label htmlFor="CompletedDate">CompleteDate</label>
      <input type="date" name="CompletedDate" id="CompletedDate" defaultValue={formData.CompletedDate} min="2023-09-01" required onChange={handleChange} />

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
      
      <TextField
              id="outlined-Comments-static"
              label="Comments"
              multiline
              rows={4}
              defaultValue="Comments"
              onChange={handleChange} 
              placeholder={formData.Comments}
            />{formErrors.Comments ? <p>{formErrors.Comments}</p> : null}

      <h2>Items</h2>
      {items.map((record, index) => (
        <div>
          <EditItemInput
            key={index}
            handleItem={handleItem}
            handleQuantity={handleQuantity}
            index={index}
            record={record}
            deleteField={handleDeleteField}
          />
        </div>

      ))}
      <button name="add-btn" onClick={handleAddField}>
        Add
      </button>


      <Button variant="contained" type="submit" value="Submit" />
      <Button varaint="outlined" type="button" onClick={handleCancel}>Cancel</Button>
    </form>
    </CardContent>
    </Card>
    </Grid>
    </>
  )
}

export default EditOrder;