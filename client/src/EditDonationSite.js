import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";

function EditDonationSite(){
    const { id } = useParams();
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        Axios.get(`http://localhost:3306/donationsite/${id}/edit`).then((response) => {
          response.data.map((key, value) => { setFormData(key) });
        })
      }, [])


    function handleChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const validate = (e) => {
        e.preventDefault();
        const errors = {};
        const regex_name = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]).*$/;
        const regex_address = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]|[0-9]).*$/;

    
        if (!regex_name.test(formData.Name)) {
          errors.Name = "The name contains an SQL keyword!"
        }

        if (!regex_address.test(formData.Address)) {
            errors.Address = "The address contains an SQL keyword!"
          }
        setFormErrors(errors)
        if (!errors.Name && !errors.Address) {
            handleSubmit()
        }
    }

    async function handleSubmit() {
        await Axios.put(`http://localhost:3306/donationsite/${id}/update`, {
          name: formData.Name,
          address: formData.Address
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(window.location.href = "/donationsite");
      }

    return(
        <div>
            <form onSubmit={validate}>
                <label htmlFor="Name">Name</label>
                <input type="text" name="Name" id="Name" defaultValue={formData.Name} required onChange={handleChange}/>
                {formErrors.Name ? <p>{formErrors.Name}</p> : null}

                <label htmlFor="Address">Address</label>
                <input type="text" name="Address" id="Address" defaultValue={formData.Address} required onChange={handleChange}/>
                {formErrors.Address ? <p>{formErrors.Address}</p> : null}

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default EditDonationSite;