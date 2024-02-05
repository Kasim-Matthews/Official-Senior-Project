import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Pagination from "./components/Pagination";
import OrderPosts from "./components/OrderPosts";


function Order() {

  const navigate = useNavigate();
  const [partners, setPartners] = React.useState([])
  const [filters, setFilters] = React.useState({
    Partner: "",
    deliverymethod: "",
    date: ""
  })
  const [distributionsList, setDistributionsList] = React.useState([])
  const [records, setRecords] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage] = React.useState(2);

  //Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = records.slice(indexOfFirstPost, indexOfLastPost)


  function handleChange(event) {
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        [event.target.name]: event.target.value
      }
    })
  }

  //Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

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
    let GetData = function(id){
      return Axios.get(`http://localhost:3001/distribution/${id}/cleanup`).then((response) => {
        return response
      });
    }
    let data = GetData(id)
    data.then((response) => {
      for(const record of response.data){
        Axios.put("http://localhost:3001/distribution/reclaim", { Quantity: record.Quantity + record.Given, ItemLocationFK: record.ItemLocationFK})
      }
    })
    
    Axios.delete(`http://localhost:3001/distribution/remove/${id}`);
    
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
      <OrderPosts posts={currentPosts} handleView={handleView} handleComplete={handleComplete} handleIncomplete={handleIncomplete} handleEdit={handleEdit} handleRemove={handleRemove} />
      <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />
      <button><Link to="/Dashboard">Dasboard</Link></button>
    </div>

  );
}

export default Order;



