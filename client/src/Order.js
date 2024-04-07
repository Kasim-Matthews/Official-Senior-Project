import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Pagination from "./components/Pagination";
import OrderPosts from "./components/OrderPosts";
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file


function Order() {

  const navigate = useNavigate();
  const [partners, setPartners] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const [filters, setFilters] = React.useState({
    Partner: "",
    Location: "",
    Status: "",
  })

  const [state, setState] = React.useState([{
    startDate: new Date(),
    endDate: addDays(new Date(), 30),
    key: 'selection'
  }])

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

    if (filters.Location != "") {
      temp = temp.filter(f => f.Location == filters.Location);
    }


    if (state != null) {
      temp = temp.filter(f => new Date(f.CompletedDate) >= state[0].startDate && new Date(f.CompletedDate) <= state[0].endDate)
    }

    if (filters.Status != "") {
      temp = temp.filter(f => f.Status == filters.Status);
    }

    setRecords(temp);
  }


  useEffect(() => {
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/distribution").then((response) => {
      setDistributionsList(response.data);
      setRecords(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/partner").then((response) => {
      setPartners(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/location").then((response) => {
      setLocations(response.data);
    })
  }, [])



  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to reclaim this distribution?") == true) {
      let GetData = async function (id) {
        return await Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/distribution/${id}/cleanup`).then((response) => {
          return response
        });
      }
      let data = GetData(id)
      data.then(async (response) => {
        await Axios.put("https://diaper-bank-inventory-management-system.onrender.com/distribution/reclaim", { records: response.data })
      })

      await Axios.delete(`https://diaper-bank-inventory-management-system.onrender.com/distribution/remove/${id}`);

      window.location.reload(false);
    }

  }

  const handleEdit = (id) => {
    navigate(`/distribution/${id}/edit`)
  }
  const handleView = (id) => {
    navigate(`/distribution/${id}`)
  }

  const handleComplete = (id) => {
    Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/distribution/${id}/complete`);
    window.location.reload(false);
  }

  const handleIncomplete = (id) => {
    Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/distribution/${id}/incomplete`);
    window.location.reload(false);
  }

  const handleprint = (id) => {
    navigate(`/distribution/${id}/print.pdf`)
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

        <label htmlFor="Location">
          Location
          <select id="Location" name="Location" value={filters.Location} onChange={handleChange}>
            <option value=""></option>
            {locations.map((val) => {
              return (
                <option value={val.Name}>{val.Name}</option>
              )
            })}

          </select>

        </label>

        <label htmlFor="Status">
          Status
          <select id="Status" name="Status" value={filters.Status} onChange={handleChange}>
            <option value=""></option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
          </select>
        </label>

        <DateRangePicker onChange={item => setState([item.selection])} ranges={state} months={2} showSelectionPreview={true} />



        <input type="submit" value="Filter" />
      </form>
      <button><Link to="/distribution/new">Add</Link></button>
      
      <button><Link to="/Dashboard">Dasboard</Link></button>
    </div>

  );
}

export default Order;



/* 
<OrderPosts posts={currentPosts} handleView={handleView} handleComplete={handleComplete} handleIncomplete={handleIncomplete} handleEdit={handleEdit} handleRemove={handleRemove} handleprint={handleprint} />
      <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />
*/