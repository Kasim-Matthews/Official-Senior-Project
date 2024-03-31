import React, { useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";

function EditPartner() {

  const { id } = useParams();
  const [formData, setFormData] = React.useState({})
  const [formErrors, setFormErrors] = React.useState({})




  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  useEffect(() => {
    Axios.get(`http://localhost:3306/partner/${id}/edit`).then((response) => {
      response.data.map((key, value) => { setFormData(key) });
    })
  }, [])


  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    const regex_name = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]).*$/;
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


  function handleSubmit() {
    Axios.put(`http://localhost:3306/partner/${id}/update`, {
      name: formData.Name,
      email: formData.Email
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    window.location.href = "/partner";

  }
  return (
    <form id="edit partnerForm" onSubmit={validate}>
      <div>
        <label htmlFor="Name">Name</label>
        <input type="text" name="Name" id="Name" defaultValue={formData.Name} onChange={handleChange} required />
      </div>

      {formErrors.Name ? <p>{formErrors.Name}</p> : null}

      <div>
        <label htmlFor="Email">Email</label>
        <input type="text" name="Email" defaultValue={formData.Email} id="Email" onChange={handleChange} required />
      </div>
      
      {formErrors.Email ? <p>{formErrors.Email}</p> : null}
      
      <input type="submit" value="Submit" />
    </form>
  )
}

export default EditPartner;