import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ItemInput from "./components/ItemInput";
import DriveList from "./components/DriveList";
import ManufacturerList from "./components/ManufacturerList";
import DonationSiteList from "./components/DonationSiteList";
import { useNavigate } from "react-router-dom";

function AddIntake() {

  const [formData, setFormData] = React.useState({
    Comments: "",
    RecievedDate: "",
    Value: 0.00,
    Partner: 0,
    Location: 0
  })
  const [sourceType, setSourceType] = React.useState("")
  const [locations, setLocations] = React.useState([])

  const Types = ["Product Drive", "Donation Site", "Manufacturer", "Misc Donation"]

  const [index, setIndex] = React.useState(1);
  const [items, setItems] = React.useState([
    {
      name: `item [${index}]`,
      Item_id: 0,
      Quantity: 0,

    }
  ])

  const [formErrors, setFormErrors] = useState({})

  const navigate = useNavigate()

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/donation";
    }
}

  function listtype() {
    if (sourceType == "Product Drive") {
      return (
        <DriveList handleChange={handleChange} />
      )
    }

    else if (sourceType == "Manufacturer") {
      return (
        <ManufacturerList handleChange={handleChange} />
      )
    }

    else if (sourceType == "Donation Site") {
      return (
        <DonationSiteList handleChange={handleChange} />
      )
    }
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



  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  function sourceChange(event) {
    setSourceType(event.target.value)
    listtype(event.target.value)
  }



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

 const typechecker = async (e) => {
    e.preventDefault()
    if (sourceType == "Misc Donation") {
      await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/donation/misc`).then((response) => {
      formData.Partner = response.data.data[0].Partner_id
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
      submitDonation()
    }
    return;
}
  const submitDonation = async () => {
    try {
      const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/donation/new`, { Comments: formData.Comments, RecievedDate: formData.RecievedDate, Partner: formData.Partner, Value: formData.Value, Items: items, Location_id: formData.Location })

      if(response.status == 400){
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200){
        window.location.href = "/donation";
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }
  }


  return (
    <div>
      <h2>Intake</h2>
      <form id="intake" onSubmit={typechecker}>

        <label htmlFor="Source">Source</label>
        <select id="Source" value={sourceType} onChange={sourceChange}>
          <option value="" disabled></option>
          {Types.map((type) => {
            return (
              <option value={type}>{type}</option>
            )
          })}
        </select>
        <br />
        {sourceType != "" ? listtype() : null}

        <label htmlFor="Location">Location</label>
        <select id="Location" name="Location" value={formData.Location} onChange={handleChange}>
          <option value="">--Please choose an option--</option>
          {locations.map((val) => {
            return (
              <option value={val.Location_id}>{val.Name}</option>
            )
          })}

        </select><br />

        <label htmlFor="RecievedDate">Issued on</label>
        <input type="date" name="RecievedDate" id="RecievedDate" min="2023-09-01" value={formData.RecievedDate} onChange={handleChange} /><br></br>

        <label htmlFor="Value">Money Raised</label>
        <input type="number" name="Value" id="Value" step="0.01" value={formData.Value} onChange={handleChange} />
        <textarea name="Comments" rows="4" cols="50" value={formData.Comments} onChange={handleChange} placeholder="Comment"></textarea><br></br>
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
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>

  );
}

export default AddIntake;

/* 
  return (
    <div>
      <Navbar />
      <Grid container justifyContent="center" >
      <Card 
      sx={{ marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <CardContent>
      <h2>Add Intake</h2>
      <form id="intake" onSubmit={submitPurchase}>
        <div display="flex">
        <Box sx={{ minWidth: 120 }}>
          <FormControl size="small" sx={{paddingRight:"10px"}}>
            <InputLabel id="Partner">Partner</InputLabel>
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
        </Box>

        <label htmlFor="RecievedDate">Recieved Date</label>
        <input type="date" name="RecievedDate" id="RecievedDate" min="2023-09-01" value={formData.RecievedDate} onChange={handleChange} sx={{paddingRight:"10px"}}/><br></br>

        <label htmlFor="Value">Value</label>
        <input type="number" name="Value" id="Value" step="0.01" value={formData.Value} onChange={handleChange} sx={{paddingRight:"10px"}} />
        <textarea name="Comments" rows="4" cols="50" value={formData.Comments} onChange={handleChange} placeholder="Comment" sx={{paddingRight:"10px"}}></textarea><br></br>
        </div>
        <h2>Items</h2>
        <div style={{ display: "flex", padding: "10px"}}>
          <FormControl size="small" sx={{paddingRight:"10px"}}>
            <InputLabel id="items">Items</InputLabel>
            <NativeSelect
              placeholder="Items"
              inputProps={{
                name: 'item',
                id: 'item',
              }}>
              <option disabled selected></option>
              {items.map((val) => {
                return (
                  <option value={val.Item_id}>{val.Name}</option>
                )
              })}
            </NativeSelect>
          </FormControl>

          <FormControl size="small" sx={{paddingRight:"10px"}}>
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

          <input type="number" name="Quantity" id="Quantity" required onChange={handleChange} value={formData.Quantity} sx={{paddingRight:"10px"}}/>
        </div>

        <Button variant="contained" type="submit" value="Submit" sx={{paddingRight:"10px"}}>Submit</Button>

      </form>
      </CardContent>
      </Card>
      </Grid>
    </div>
        
  );
*/