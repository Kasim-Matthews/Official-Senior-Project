import React, { useState } from "react";
import Axios from 'axios';
import Partner from './models/Partner'
import { useNavigate } from "react-router-dom";

function AddPartner() {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = React.useState(Partner)

  function handleChange(e) {

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
      window.location.href = "/partner";
    }
  }


  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    const regex_name = /^(?!.*SELECT|.*FROM|.*INSERT|.*UPDATE)(?=[a-zA-Z()\s]).*$/;
    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!regex_name.test(formData.Name) && formData.Name != "") {
      errors.Name = "The name contains an SQL keyword !"
    }

    if (!regex_email.test(formData.Email) && formData.Email != "") {
      errors.Email = "This is not a valid email format!";
    }

    setFormErrors(errors);
    if (!errors.Name && !errors.Email) {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    try {
      const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/partner/new`, {
        name: formData.Name,
        email: formData.Email,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });;


      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/partner";
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }

  }


  return (
    <form id="partnerForm" onSubmit={validate}>
      <div>
        <label htmlFor="Name">Name</label>
        <input type="text" name="Name" id="Name" value={formData.Name} onChange={handleChange} required />

      </div>
      {formErrors.Name ? <p>{formErrors.Name}</p> : null}
      <div>
        <label htmlFor="Email">Email</label>
        <input type="text" name="Email" value={formData.Email} id="Email" onChange={handleChange} required />
      </div>
      {formErrors.Email ? <p>{formErrors.Email}</p> : null}

      <button type="submit">Submit</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
    </form>
  );
}

export default AddPartner;