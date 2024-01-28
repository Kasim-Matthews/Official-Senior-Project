import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Select from 'react-select';

function EditOrder() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = React.useState([])
  const [Partner_id, setPartner_id] = React.useState()
  const [partners, setPartners] = React.useState([])




  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }



  useEffect(() => {
    Axios.get(`http://localhost:3001/distribution/${id}/edit`).then((response) => {
      setFormData(response.data[0]);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3001/partner/options").then((response) => {
      setPartners(response.data);
    })
  }, [])



  function handleSubmit(e) {
    e.preventDefault();
    Axios.put(`http://localhost:3001/distribution/${id}/update`, { Comments: formData.Comments, Status: formData.Status, DeliveryMethod: formData.DeliveryMethod, RequestDate: formData.RequestDate, CompletedDate: formData.CompletedDate, Partner_id: formData.Partner_id }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    navigate('/distribution')


  }

  return (
    <form id="edit distribution" onSubmit={handleSubmit}>
      <label htmlFor="Partner">Partner</label>
      <select id="Partner_id" name="Partner_id" onChange={handleChange}>
        <option value="">--Please choose an option--</option>
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

      </select><br />

      <label htmlFor="RequestDate">RequestDate</label>
      <input type="date" name="RequestDate" id="RequestDate" defaultValue={formData.RequestDate} min="2023-09-01" required onChange={handleChange} />

      <label htmlFor="CompletedDate">CompleteDate</label>
      <input type="date" name="CompletedDate" id="CompletedDate" defaultValue={formData.CompletedDate} min="2023-09-01" required onChange={handleChange} />

      <p>Delivery Method</p>

      <label htmlFor="Drop-off">Drop Off</label>
      <input type="radio" id="Drop-off" name="DeliveryMethod" value="Drop-off" checked={formData.DeliveryMethod === "Drop-off"} onChange={handleChange} />
      <label htmlFor="Other">Other</label>
      <input type="radio" id="Other" name="DeliveryMethod" value="Other" checked={formData.DeliveryMethod === "Other"} onChange={handleChange} />

      <textarea name="Comments" rows="4" cols="50" onChange={handleChange} placeholder={formData.Comments}></textarea>

      <input type="submit" value="Submit" />
    </form>
  )
}

export default EditOrder;