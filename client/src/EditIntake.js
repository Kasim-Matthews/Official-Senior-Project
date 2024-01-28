import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Select from 'react-select';

function EditIntake() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = React.useState([])
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
    Axios.get(`http://localhost:3001/intake/${id}/edit`).then((response) => {
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
    console.log(formData)
    Axios.put(`http://localhost:3001/intake/${id}/update`, { Comments: formData.Comments, RecievedDate: formData.RecievedDate, Partner: formData.Partner, Value: formData.Value }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    navigate('/intake')


  }

  return (
    <div>
      <h2>Intake</h2>
      <form id="intake" onSubmit={handleSubmit}>
        <label htmlFor="Partner">Partner</label>
        <select id="Partner" name="Partner" onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        {partners.map((val) => {
          if (val.value == formData.Partner) {

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

      </select>
        <br></br>

        <label htmlFor="RecievedDate">Recieved Date</label>
        <input type="date" name="RecievedDate" id="RecievedDate" min="2023-09-01" defaultValue={formData.RecievedDate} onChange={handleChange} /><br></br>

        <label htmlFor="Value">Value</label>
        <input type="number" name="Value" id="Value" step="0.01" defaultValue={formData.Value} onChange={handleChange} />
        <textarea name="Comments" rows="4" cols="50" defaultValue={formData.Comments} onChange={handleChange} placeholder={formData.Comments}></textarea><br></br>

        <input type="submit" value="Submit" />

      </form>
    </div>
  )
}

export default EditIntake;