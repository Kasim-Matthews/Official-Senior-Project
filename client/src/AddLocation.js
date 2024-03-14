import React from "react";
import Axios from 'axios';
import Location from './models/Location'
import { useNavigate } from "react-router-dom";

function AddLocation() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState(Location)
  const [items, setItems] = React.useState([])


  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      Axios.post("http://localhost:3001/location/new", {
        name: formData.Name,
        Address: formData.Address
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }
    catch (error) {
      console.log(error.response.data);
    }

    let Location_id = await Axios.get("http://localhost:3001/location/last")
    
    await Axios.post("http://localhost:3001/location/pair", {Location_id: Location_id.data[0].Location_id, Items: items}).then(window.location.href ="/location")


    
  }

  React.useEffect(() => {
    Axios.get("http://localhost:3001/item").then((response) => {
        setItems(response.data);
    })
}, [])

  return (
    <form id="locations" onSubmit={handleSubmit}>
      <label htmlFor="Name">Name</label>
      <input type="text" name="Name" value={formData.Name} id="Name" required onChange={handleChange} />

      <label htmlFor="Address">Address</label>
      <input type="text" name="Address" value={formData.Address} id="Address" required onChange={handleChange} />


      <input type="submit" value="Submit" />
    </form>
  )
}

export default AddLocation;