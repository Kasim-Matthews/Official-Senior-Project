import React, { useState, useEffect } from "react";
import Axios from 'axios';
import DonationSite from './models/DonationSite'

function AddDonationSite() {
  const [formData, setFormData] = useState(DonationSite)
  const [formErrors, setFormErrors] = useState({})

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
      window.location.href = "/donationsite";
    }
  }

  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    const regex_name = /^(?!.*SELECT|.*FROM|.*INSERT|.*UPDATE)(?=[a-zA-Z()\s]).*$/;
    const regex_address = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]|[0-9]).*$/;


    if (!regex_name.test(formData.Name)) {
      errors.Name = "The name contains an SQL keyword or a special character!"
    }

    if (!regex_address.test(formData.Address)) {
      errors.Address = "The address contains an SQL keyword !"
    }
    setFormErrors(errors)
    if (!errors.Name && !errors.Address) {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    try {
      const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/donationsite/new`, {
        name: formData.Name,
        address: formData.Address
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });


      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/donationsite";
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }
  }

  return (
    <div>
      <form onSubmit={validate}>
        <label htmlFor="Name">Name</label>
        <input type="text" name="Name" id="Name" value={formData.Name} required onChange={handleChange} />
        {formErrors.Name ? <p>{formErrors.Name}</p> : null}

        <label htmlFor="Address">Address</label>
        <input type="text" name="Address" id="Address" value={formData.Address} required onChange={handleChange} />
        {formErrors.Address ? <p>{formErrors.Address}</p> : null}

        <input type="submit" value="Submit" />
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  )
}

export default AddDonationSite;