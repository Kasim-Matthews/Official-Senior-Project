import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Pagination from "./components/Pagination";
import OrderPosts from "./components/OrderPosts";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import './Order.css'; import { DateRangePicker } from 'react-date-range'
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
    Date: ""
  })

  const [distributionsList, setDistributionsList] = React.useState([])
  const [records, setRecords] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage] = React.useState(10);

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

  function clearFilters(e) {
    e.preventDefault();

    setFilters({
      Partner: "",
      Location: "",
      Status: "",
      Date: ""
    })
    setRecords(distributionsList)
  }

  function handleSubmit(e) {
    e.preventDefault();
    var temp = distributionsList;

    if (filters.Partner != "") {
      temp = temp.filter(f => f.Name == filters.Partner);
    }

    if (filters.Location != "") {
      temp = temp.filter(f => f.Location == filters.Location);
    }


    if (filters.Date != "") {
      temp = temp.filter(f => new Date(f.CompletedDate) >= new Date(filters.Date))
    }

    if (filters.Status != "") {
      temp = temp.filter(f => f.Status == filters.Status);
    }

    setRecords(temp);
    console.log(filters)
  }


  useEffect(() => {
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/distribution").then((response) => {
      setDistributionsList(response.data.data);
      setRecords(response.data.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/partner/use").then((response) => {
      setPartners(response.data.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("https://diaper-bank-inventory-management-system.onrender.com/location/use").then((response) => {
      setLocations(response.data.data);
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

  console.log(distributionsList)

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: '#065AB0' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/Dashboard" style={{ textDecoration: 'none', color: 'white' }}>{'Dashboard'}</Link>
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/distribution" style={{ textDecoration: 'none', color: 'white' }}>Distributions</Link>
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/intake" style={{ textDecoration: 'none', color: 'white' }}>Collections</Link>
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="#" style={{ textDecoration: 'none', color: 'white' }}>Inventory</Link>
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/partner" style={{ textDecoration: 'none', color: 'white' }}>Partner</Link>
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <form onSubmit={handleSubmit}>
        <h2>Distributions Table</h2>
        <Card>
          <CardContent>
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

            <label>
              Date Range
              <input type="date" name="Date" value={filters.Date} onChange={handleChange} />
            </label>



            <input type="submit" value="Filter" />
            <button onClick={clearFilters}>Clear</button>
          </CardContent>
          </Card >
      </form>

      <button><Link to="/distribution/new">Add</Link></button>
      <OrderPosts posts={currentPosts} handleView={handleView} handleComplete={handleComplete} handleIncomplete={handleIncomplete} handleEdit={handleEdit} handleRemove={handleRemove} handleprint={handleprint} />
      <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />
    </div>

  );
}

export default Order;



/* 
<div className='partner'>
            <TextField
              id="outlined-select-partner"
              select
              label="Partner"
              defaultValue="Partner"
              helperText="Please select a partner"
            >
              <MenuItem value="">
                </MenuItem>
              {partners.map((option) => (
                <MenuItem value={option.Name}>
                  {option.Name}
                </MenuItem>
              ))}
            </TextField>
            </div>
            <div className='delivery'>
            <FormControl>
              <FormLabel id="delivery-method">Please select a delivery method</FormLabel>
              <RadioGroup
                row
                aria-labelledby="delivery-method-label"
                name="delivery-method-group"
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="drop-off" control={<Radio />} label="Drop-off" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
            </div>
            <div className='date'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="Date" />
              </DemoContainer>
            </LocalizationProvider>
            </div>   
            <div className='submit'>
            <Button variant="contained"><input type="Submit"/></Button>
            </div>
*/