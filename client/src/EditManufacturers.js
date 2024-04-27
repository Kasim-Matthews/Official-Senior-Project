import React, { useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function EditManufacturers() {

  const { id } = useParams();
  const [formData, setFormData] = React.useState({})
  const navigate = useNavigate();


  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/manufacturers";
    }
}


  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  useEffect(() => {
    Axios.get(`http://localhost:3001/manufacturers/${id}/edit`).then((response) => {
      if (response.data.status === 'complete') {
        response.data.data.map((key, value) => { setFormData(key) });
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



  function handleSubmit(e) {
    e.preventDefault();

    Axios.put(`http://localhost:3001/manufacturers/${id}/update`, { name: formData.Name, }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    window.location.href = "/manufacturers";

  }
  return (
    <form id="edit location Form" onSubmit={handleSubmit}>
      <label htmlFor="Name">Name</label>
      <input type="text" name="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange} />
      <input type="submit" value="Submit" />
      <button onClick={handleCancel}>Cancel</button>
    </form>
  )
}

export default EditManufacturers;