import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import EditItemInput from "./components/EditItemInput";
import Navbar from "./components/navbar";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
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

  const [index, setIndex] = React.useState(0);

  const [items, setItems] = React.useState([])

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
      window.location.href = "/distribution";
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
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/edit`).then((response) => {
      if (response.data.status === 'complete') {
        setFormData(response.data.data[0]);
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
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/edititems`).then((response) => {
      if (response.data.status === 'complete') {
        setItems(response.data.data);
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
    let ild = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/distribution/edit_validation`, { Items: items, Location_id: formData.Location_id });
    var result = []
    for (let o1 of ild.data.data) {
      for (let o2 of items) {
        if (o1.Item_id == o2.Item) {
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
    try {
      const response = await await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/update`, { Comments: formData.Comments, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner_id, Items: items, Location_id: formData.Location_id });

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

  // return (
  //   <form id="edit distribution" onSubmit={validate}>
  //     <label htmlFor="Partner">Partner</label>
  //     <select id="Partner_id" name="Partner_id" value={formData.Partner_id} onChange={handleChange}>
  //       <option value="">--Please choose an option--</option>
  //       {partners.map((val) => {
  //         if (val.Partner_id == formData.Partner_id) {
  //           return (
  //             <option value={val.Partner_id} selected>{val.Name}</option>
  //           )
  //         }
  //         else {
  //           return (
  //             <option value={val.Partner_id}>{val.Name}</option>
  //           )
  //         }
  //       })}

  //     </select><br />

  //     <label htmlFor="Location">Location</label>
  //     <select id="Location_id" name="Location_id" value={formData.Location_id} onChange={handleChange}>
  //       <option value="">--Please choose an option--</option>
  //       {locations.map((val) => {
  //         if (val.Location_id == formData.Location_id) {

  //           return (
  //             <option value={val.Location_id} selected>{val.Name}</option>
  //           )
  //         }
  //         else {
  //           return (
  //             <option value={val.Location_id}>{val.Name}</option>
  //           )
  //         }
  //       })}

  //     </select><br />

  //     <label htmlFor="RequestDate">RequestDate</label>
  //     <input type="date" name="RequestDate" id="RequestDate" Value={formData.RequestDate} required onChange={handleChange} />

  //     <label htmlFor="CompletedDate">CompleteDate</label>
  //     <input type="date" name="CompletedDate" id="CompletedDate" Value={formData.CompletedDate} min={formData.RequestDate} required onChange={handleChange} />

  //     <h3>Delivery Method</h3>

  //     <label htmlFor="Drop-off">Drop Off</label>
  //     <input type="radio" id="Drop-off" name="DeliveryMethod" value="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange} />
  //     <label htmlFor="Pick-up">Pick-up</label>
  //     <input type="radio" id="Pick-up" name="DeliveryMethod" value="Pick-up" checked={formData.DeliveryMethod === "Pick-up"} onChange={handleChange} />
  //     <label htmlFor="Shipped">Shipped</label>
  //     <input type="radio" id="Shipped" name="DeliveryMethod" value="Shipped" checked={formData.DeliveryMethod === "Shipped"} onChange={handleChange} />

  //     <textarea name="Comments" rows="4" cols="50" onChange={handleChange} placeholder={formData.Comments}></textarea>
  //     {formErrors.Comments ? <p>{formErrors.Comments}</p> : null}
  //     <h2>Items</h2>
  //     {items.map((record, index) => (
  //       <div>
  //         <EditItemInput
  //           key={index}
  //           handleItem={handleItem}
  //           handleQuantity={handleQuantity}
  //           index={index}
  //           record={record}
  //           deleteField={handleDeleteField}
  //         />
  //       </div>

  //     ))}
  //     <button name="add-btn" onClick={handleAddField}>
  //       Add
  //     </button>


  //     <input type="submit" value="Submit" />
  //     <button type="button" onClick={handleCancel}>Cancel</button>
  //   </form>
  // )

  return (
    <>
      <Navbar />
      <Grid container justifyContent="center" >
        <Card
          sx={{ paddingtop: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CardContent>
            <h2>Edit Order</h2>
            <form id="edit distribution" onSubmit={validate}>
              <div display="flex" padding="10px">
                <FormControl size="small" sx={{ padding: "10px" }}>
                  <InputLabel id="partner">Partner</InputLabel>
                  <NativeSelect
                    placeholder="Partner"
                    inputProps={{
                      name: 'partner',
                      id: 'partner',
                    }} id="Partner_id" name="Partner_id" value={formData.Partner_id} onChange={handleChange}>
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

                <FormControl size="small" sx={{ padding: "10px" }}>
                  <InputLabel id="location">Location</InputLabel>
                  <NativeSelect
                    placeholder="Location"
                    inputProps={{
                      name: 'location',
                      id: 'location',
                    }} id="Location_id" name="Location_id" value={formData.Location_id} onChange={handleChange}>
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
                <div style={{ padding: "10px" }}></div>
                <label htmlFor="RequestDate" style={{ padding: "5px" }}>RequestDate</label>
                <input type="date" name="RequestDate" id="RequestDate" defaultValue={formData.RequestDate} min="2023-09-01" required onChange={handleChange} />

                <label htmlFor="CompletedDate" style={{ padding: "5px" }}>CompleteDate</label>
                <input type="date" name="CompletedDate" id="CompletedDate" defaultValue={formData.CompletedDate} min="2023-09-01" required onChange={handleChange} />
              </div>
              <FormControl sx={{ padding: "10px" }}>
                <FormLabel id="delivery-method">Please select a delivery method</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="delivery-method-label"
                  name="delivery-method-group"
                >
                  <FormControlLabel value="Drop-off" control={<Radio />} label="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange} />
                  <FormControlLabel value="Pick-up" control={<Radio />} label="Pick-up" checked={formData.DeliveryMethod === "Pick-up"} onChange={handleChange} />
                  <FormControlLabel value="Shipped" control={<Radio />} label="Shipped" checked={formData.DeliveryMethod === "Shipped"} onChange={handleChange} />
                </RadioGroup>
              </FormControl>

              <TextField
                id="outlined-Comments-static"
                label="Comments"
                multiline
                rows={4}
                onChange={handleChange}
                placeholder={formData.Comments}
                sx={{ padding: "10px" }}
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
                    sx={{ padding: "10px" }}
                  />
                </div>

              ))}
              <Button variant="outlined" name="add-btn" onClick={handleAddField}>
                Add
              </Button>


              <Button variant="contained" type="submit" value="Submit" sx={{ padding: "10px" }}>Submit</Button>
              <Button varaint="outlined" type="button" onClick={handleCancel} sx={{ padding: "10px" }}>Cancel</Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default EditOrder;