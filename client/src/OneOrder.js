import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewOrder() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = React.useState([])
  const [itemList, setItemList] = React.useState([])

  useEffect(() => {
    Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/distribution/${id}/view`).then((response) => {
      setRecord(response.data.data[0])
    });
  }, [])

  useEffect(() => {
    Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/distribution/${id}/itemlist`).then((response) => {
      setItemList(response.data.data)
    });
  }, [])

  const totalQuantity = itemList.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
  const total = itemList.reduce((sum, val) => sum + (parseFloat(val.Quantity) * parseFloat(val.FairMarketValue)), 0);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Partner</th>
            <th>Requested Date</th>
            <th>Completed Date</th>
            <th>Delivery Method</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{record.Name}</td>
            <td>{record.RequestDate}</td>
            <td>{record.CompletedDate}</td>
            <td>{record.DeliveryMethod}</td>
            <td>{record.Location}</td>
            <td>{record.Status}</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Value/item</th>
            <th>In-kind Value</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((val) => {
            return (
              <tr>
                <td>{val.Item}</td>
                <td>{val.FairMarketValue}</td>
                <td>${Math.round((val.FairMarketValue * val.Quantity) * 100) / 100}</td>
                <td>{val.Quantity}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td>${total}</td>
            <td>{totalQuantity}</td>
          </tr>
        </tfoot>
      </table>
      <button><Link to="/Dashboard">Dasboard</Link></button>
    </div>
  )
}

export default ViewOrder;