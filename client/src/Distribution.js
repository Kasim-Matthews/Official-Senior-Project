import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";


function Distribution() {

  const navigate = useNavigate();
  const [partners, setPartners] = React.useState([])
  const [filters, setFilters] = React.useState({
    Partner: "",
    deliverymethod: "",
    date: ""
  })
  const [distributionsList, setDistributionsList] = React.useState([])
  const [records, setRecords] = React.useState([]);

  function handleChange(event) {
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        [event.target.name]: event.target.value
      }
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    var temp = distributionsList;

    if (filters.Partner != "") {
      temp = temp.filter(f => f.Name == filters.Partner);
    }

    if (filters.deliverymethod == "Other") {
      temp = temp.filter(f => f.DeliveryMethod == filters.deliverymethod);
    }

    if (filters.deliverymethod == "Drop-off") {
      temp = temp.filter(f => f.DeliveryMethod == filters.deliverymethod);
    }

    if (filters.date != "") {
      temp = temp.filter(f => f.CompletedDate > filters.date)
    }

    /*if(filters.source != ""){
      temp = temp.filter(f => f.source.includes(filters.source.toLowerCase()))
    }*/

    setRecords(temp);
  }


  useEffect(() => {
    Axios.get("http://localhost:3001/distribution").then((response) => {
      setDistributionsList(response.data);
      setRecords(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3001/partner").then((response) => {
      setPartners(response.data);
    })
  }, [])



  const handleRemove = (id) => {
    //Axios.delete(`http://localhost:3001/distribution/remove/${id}`);
    window.location.reload(false);
  }

  const handleEdit = (id) => {
    navigate(`/distribution/${id}/edit`)
  }
  const handleView = (id) => {
    navigate(`/distribution/${id}`)
  }

  const handleComplete = (id) => {
    Axios.put(`http://localhost:3001/distribution/${id}/complete`);
    window.location.reload(false);
  }

  const handleIncomplete = (id) => {
    Axios.put(`http://localhost:3001/distribution/${id}/incomplete`);
    window.location.reload(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Partner">
          Partner
          <select id="Partner" name="Partner" value={filters.Partner} onChange={handleChange}>
            <option value=""></option>
            {partners.map((val) => {
              return (
                <option value={val.Name}>{val.Name}</option>
              )
            })}

          </select>

        </label>
        <label>
          <input type="radio" value="All" name="deliverymethod" onChange={handleChange} checked={filters.deliverymethod == "All"} />
          All
        </label>
        <label>
          <input type="radio" value="Drop-off" name="deliverymethod" onChange={handleChange} checked={filters.deliverymethod == "Drop-off"} />
          Drop-off
        </label>
        <label>
          <input type="radio" value="Other" name="deliverymethod" onChange={handleChange} checked={filters.deliverymethod == "Other"} />
          Other
        </label>

        <input type="date" name="date" value={filters.date} onChange={handleChange} />


        <input type="submit" value="Submit" />
      </form>
      <h2 style={{ display: 'none' }}>Change ifs to == rather than include</h2>
      <button><Link to="/distribution/new">Add</Link></button>
      <table>
        <thead>
          <tr>
            <th>Partner</th>
            <th>Requested Date</th>
            <th>Completed Date</th>
            <th>Delivery Method</th>
            <th>Comments</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((val) => {
            let q = new Date(val.RequestDate);
            let monthRequestDate = ""
            let dayRequestDate = ""
            let yearRequestDate = ""
            let concatRequestDate = ""
            monthRequestDate = q.getMonth() + 1
            dayRequestDate = q.getDate() + 1
            yearRequestDate = q.getFullYear() + 1
            concatRequestDate = yearRequestDate + "-" + monthRequestDate + "-" + dayRequestDate

            let c = new Date(val.CompletedDate);
            let monthCompletedDate = ""
            let dayCompletedDate = ""
            let yearCompletedDate = ""
            let concatCompletedDate = ""
            monthCompletedDate = c.getMonth() + 1
            dayCompletedDate = c.getDate() + 1
            yearCompletedDate = c.getFullYear() + 1
            concatCompletedDate = yearCompletedDate + "-" + monthCompletedDate + "-" + dayCompletedDate
            return (
              <tr>
                <td>{val.Name}</td>
                <td>{concatRequestDate}</td>
                <td>{concatCompletedDate}</td>
                <td>{val.DeliveryMethod}</td>
                <td>{val.Comments}</td>
                <td>{val.Status}</td>
                <td>
                  <button /*onClick={() => handleRemove(val.Order_id)}*/>Delete</button>
                  {val.Status == 'Draft' ? (<button onClick={() => handleEdit(val.Order_id)}>Edit</button>) : null}
                  <button onClick={() => handleView(val.Order_id)}>View</button>
                  {val.Status == 'Draft' ? (<button onClick={() => handleComplete(val.Order_id)}>Complete</button>) : null}
                  {val.Status == 'Submitted' ? (<button onClick={() => handleIncomplete(val.Order_id)}>Uncomplete</button>) : null}

                </td>
              </tr>);
          })}
        </tbody>
      </table>
      <button><Link to="/Dashboard">Dasboard</Link></button>
    </div>

  );
}

export default Distribution;



