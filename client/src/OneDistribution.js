import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewDistribution() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = React.useState([])

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/view`).then((response) => {
      if (response.data.status === 'complete') {
        setRecord(response.data.data)
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


  return (
    <div>
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
          {record.map((val) => {
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
                <td>{val.Partner_id}</td>
                <td>{concatRequestDate}</td>
                <td>{concatCompletedDate}</td>
                <td>{val.DeliveryMethod}</td>
                <td>{val.Comments}</td>
                <td>{val.Status}</td>
              </tr>);
          })}
        </tbody>
      </table>
      <button><Link to="/Dashboard">Dasboard</Link></button>
    </div>
  )
}

export default ViewDistribution;