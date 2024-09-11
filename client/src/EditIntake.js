import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";
import EditDriveList from "./components/EditDriveList";
import EditDonationSiteList from './components/EditDonationSiteList';
import EditManufacturerList from './components/EditManufacturerList';
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function EditIntake() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const [sourceType, setSourceType] = React.useState()
  const [formErrors, setFormErrors] = useState({})

  const [index, setIndex] = React.useState(0);

  const [items, setItems] = React.useState([])

  const Types = ["Product Drive", "Donation Site", "Manufacturer", "Misc Donation"]


  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/intake";
    }
}

  function listtype() {
    if (sourceType == "Product Drive") {
      return (
        <EditDriveList handleChange={handleChange} id={formData.Partner} />
      )
    }

    else if (sourceType == "Manufacturer") {
      return (
        <EditManufacturerList handleChange={handleChange} id={formData.Partner} />
      )
    }

    else if (sourceType == "Donation Site") {
      return (
        <EditDonationSiteList handleChange={handleChange} id={formData.Partner} />
      )
    }
  }


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
    Axios.get(`http://localhost:3001/intake/${id}/edit`).then((response) => {
      setFormData(response.data[0]);
      setSourceType(response.data[0].Type)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    Axios.get(`http://localhost:3001/intake/${id}/edititems`).then((response) => {
      setItems(response.data);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    Axios.get("http://localhost:3001/location/use").then((response) => {
      setLocations(response.data);
    })
  }, [])

  const typechecker = async (e) => {
    e.preventDefault()
    if (sourceType == "Misc Donation") {
      await Axios.get("http://localhost:3001/intake/misc").then((response) => {
        setFormData(prevFormData => {
          return {
            ...prevFormData,
            Partner: response.data[0].Partner_id
          }
        })
      })
    }
    validate();
    return
  }

  const validate = () => {
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

  async function handleSubmit() {

    let GetData = async function (id) {
      return await Axios.get(`http://localhost:3001/intake/${id}/cleanup`).then((response) => {
        return response
      });
    }
    let data = GetData(id)
    data.then(async (response) => {
      await Axios.put("http://localhost:3001/intake/reclaim", { records: response.data })
    })


    await Axios.delete(`http://localhost:3001/intake/${id}/edit_delete`)


    await Axios.put(`http://localhost:3001/intake/${id}/update`, { Comments: formData.Comments, RecievedDate: formData.RecievedDate, Partner: formData.Partner, Value: formData.Value }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    let V_response = await Axios.post("http://localhost:3001/intake/find_value", { Items: items })
    let IL_response = await Axios.post("http://localhost:3001/intake/location", { Items: items, Location_id: formData.Location })

    await Axios.post("http://localhost:3001/intake/track", { Intake_id: id, Items: items, Values: V_response.data, FKItemLocation: IL_response.data });
    await Axios.put("http://localhost:3001/intake/update_item", { Items: items, ItemLocationFK: IL_response.data });
    navigate('/intake')

  }

  function sourceChange(event) {
    setSourceType(event.target.value)
    listtype(event.target.value)
  }


  return (
    <div>
      <Navbar />
      <Grid container justifyContent="center" >
          <Card 
          sx={{ paddingtop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}} 
          >
          <CardContent>
      <h2>Edit Intake</h2>
      <form id="intake" onSubmit={typechecker}>
      <div display="flex" padding="10px">
      <FormControl size="small" sx={{paddingRight:"20px"}}>
            <InputLabel id="type">Type</InputLabel>
            <NativeSelect
              placeholder="Type"
              inputProps={{
                name: 'type',
                id: 'type',
              }}>
              {Types.map((type) => {
            if (formData.Type == type) {
              return (
                <option value={type} selected>{type}</option>
              )
            }
            else {
              return (
                <option value={type}>{type}</option>
              )
            }
          })}
            </NativeSelect>
          </FormControl>
        <br />

        {sourceType != "" ? listtype() : null}

        <FormControl size="small" sx={{paddingRight:"20px"}}>
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
        <div style={{padding:"10px"}}>
        <label htmlFor="RecievedDate" style={{padding:"5px"}} >Issued On</label>
        <input type="date" name="RecievedDate" id="RecievedDate" min="2023-09-01" defaultValue={formData.RecievedDate} onChange={handleChange} /><br></br>

        <label htmlFor="Value" style={{padding:"5px"}}>Money Raised</label>
        <input type="number" name="Value" id="Value" step="0.01" defaultValue={formData.Value == null ? 0.00 : formData.Value} onChange={handleChange} />
        <textarea name="Comments" rows="4" cols="50" defaultValue={formData.Comments} onChange={handleChange} placeholder={formData.Comments}></textarea><br></br>
        </div>
        {formErrors.Comments ? <p>{formErrors.Comments}</p> : null}
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
              sx={{paddingRight:"10px"}}
            />
          </div>

        ))}
        <Button variant="outlined" name="add-btn" onClick={handleAddField} sx={{paddingRight:"10px"}}>
          Add
        </Button>

        </div>
        <Button variant="contained" type="submit" value="Submit" onClick={handleSubmit} sx={{paddingRight:"10px"}}>Submit</Button>
        <Button variant="outlined" type="button" onClick={handleCancel} sx={{paddingRight:"10px"}}>Cancel</Button>

      </form>
      </CardContent>
      </Card>
      </Grid>
    </div>
  )
}

export default EditIntake;