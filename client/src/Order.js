import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Pagination from "./components/Pagination";
import OrderPosts from "./components/OrderPosts";
import  Box  from '@mui/material/Box';
import  AppBar  from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import  IconButton  from '@mui/material/IconButton';
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
import './Order.css';import { DateRangePicker } from 'react-date-range'
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
    Axios.get("http://localhost:3306/distribution").then((response) => {
      setDistributionsList(response.data);
      setRecords(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3306/partner/use").then((response) => {
      setPartners(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:3306/location/use").then((response) => {
      setLocations(response.data);
    })
  }, [])



  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to reclaim this distribution?") == true) {
      let GetData = async function (id) {
        return await Axios.get(`http://localhost:3306/distribution/${id}/cleanup`).then((response) => {
          return response
        });
      }
      let data = GetData(id)
      data.then(async (response) => {
        await Axios.put("http://localhost:3306/distribution/reclaim", { records: response.data })
      })

      await Axios.delete(`http://localhost:3306/distribution/remove/${id}`);

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
    Axios.put(`http://localhost:3306/distribution/${id}/complete`);
    window.location.reload(false);
  }

  const handleIncomplete = (id) => {
    Axios.put(`http://localhost:3306/distribution/${id}/incomplete`);
    window.location.reload(false);
  }

  const handleprint = (id) => {
    navigate(`/distribution/${id}/print.pdf`)
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ bgcolor: '#065AB0'}}>
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
              <div className='partner'>
            <TextField
              id="outlined-select-partner"
              select
              label="Partner"
              defaultValue="Partner"
              helperText="Please select a partner"
            >
              {partners.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
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
            <Button variant="contained">Submit</Button>
            </div>
            </CardContent>
            </Card>
      </form>
      <button><Link to="/distribution/new">Add</Link></button>
      <OrderPosts posts={currentPosts} handleView={handleView} handleComplete={handleComplete} handleIncomplete={handleIncomplete} handleEdit={handleEdit} handleRemove={handleRemove} handleprint={handleprint} />
      <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />
    </div>

  );
}

export default Order;



