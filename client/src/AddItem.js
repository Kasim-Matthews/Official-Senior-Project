import React from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

function AddItem() {
  const navigate = useNavigate();

  const [isActive, setIsActive] = React.useState(true)
  const [formData, setFormData] = React.useState(
    {
      Name: "",
      FairMarketValue: 0.00,
    }
  )


  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    try {

      Axios.post("http://localhost:3001/item/new", {
        name: formData.Name,
        FairMarketValue: formData.FairMarketValue
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }
    catch (error) {
      console.log(error.response.data);
    }

    window.location.href = "/item";
  }

  return (
    <form id="item" onSubmit={handleSubmit}>
      <label htmlFor="Name">Name</label>
      <input type="text" name="Name" value={formData.Name} id="Name" required onChange={handleChange} />

      <label htmlFor="FairMarketValue">Fair Market Value</label>
      <input type="number" name="FairMarketValue" id="FairMarketValue" value={formData.FairMarketValue} step="0.01" required onChange={handleChange} />


      <input type="submit" value="Submit" />
    </form>
  )
}

export default AddItem;