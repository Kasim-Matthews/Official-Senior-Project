import React, { useState } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

function AddPartner() {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = React.useState({
    Name: "",
    Email: "",
  })
  const [isSubmit, setIsSubmit] = useState(false);

  function handleChange(e) {

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const validate = (values) => {
    const errors = {};
    const regex_name = /^(?=.{1,50}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!regex_name.test(values.Name)) {
      errors.Name = "The name contains special characters!"
    }

    if (!regex_email.test(values.Email)) {
      errors.Email = "This is not a valid email format!";
    }

    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormErrors(validate(formData));
    setIsSubmit(true);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      Axios.post("http://localhost:3001/partner/new", {
        name: formData.Name,
        email: formData.Email
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      window.location.href = "/partner";
    }

  }

  return (
    <form id="partnerForm" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="Name">Name</label>
        <input type="text" name="Name" id="Name" value={formData.Name} onChange={handleChange} required />

      </div>
      <p>{formErrors.Name}</p>
      <div>
        <label htmlFor="Email">Email</label>
        <input type="text" name="Email" value={formData.Email} id="Email" onChange={handleChange} required />
      </div>
      <p>{formErrors.Email}</p>

      <button type="submit">Submit</button>
    </form>
  );
}

export default AddPartner;