import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, Link} from "react-router-dom";
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';


function Distribution() {

  const navigate = useNavigate();
  const [partners, setPartners] = React.useState([])
  const [filters, setFilters] = React.useState({
    Partner:"",
    deliverymethod:"",
    date:""
  })
  const [distributionsList, setDistributionsList] = React.useState([])
  const [records, setRecords] = React.useState([]);

  function handleChange(event){
    setFilters(prevFilters => {
      return{
        ...prevFilters,
        [event.target.name] : event.target.value
      }
    })
  }

  function handleSubmit(e){
    e.preventDefault();
    var temp = distributionsList;
    if(filters.Partner != ""){
      temp = temp.filter(f => f.partner.includes(filters.Partner.toLowerCase()));
    }

    if(filters.deliverymethod == "Pickup"){
      temp = temp.filter(f => f.deliverymethod == filters.deliverymethod);
    }

    if(filters.deliverymethod == "Delivery"){
      temp = temp.filter(f => f.deliverymethod == filters.deliverymethod);
    }

    if(filters.date != ""){
      temp = temp.filter(f => f.date > filters.date)
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
    Axios.get("http://localhost:3001/partner").then((response) =>{
            setPartners(response.data);
        })
  }, [])

  const Filter = (event) => {
    setRecords(distributionsList.filter(f => f.partner.includes(event.target.value)))
  };

  const FilterRadio = (event) =>{
    setRecords(distributionsList.filter(f => f.deliverymethod.includes(event.target.value)))
  };

  const FilterRadioReset = (event) =>{
    setRecords(distributionsList)
  }


  const FilterDate = (event) =>{
    setRecords(distributionsList.filter(f => f.RequestDate > event.target.value))
  }

  const handleRemove = (id) =>{
    Axios.delete(`http://localhost:3001/remove/${id}`);
  }

  const handleEdit = (id) => {
    navigate(`/distribution/${id}/edit`)
  }
  const handleView = (id) => {
    navigate(`/distribution/${id}`)
  }

  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
  
    const handleClose = () => {
      onClose(selectedValue);
    };

    return(
      <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <form style={{ display: 'none' }} onSubmit={handleSubmit}>
          <label htmlFor="Partner">
            Partner
            <select id="Partner" name="Partner" value={filters.Partner} onChange={handleChange}>
              <option value="" disabled></option>
              {partners.map((val) => {
                return (
                  <option value={val.Name}>{val.Name}</option>
                );
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
          <input type="date" onChange={handleChange} value={filters.date} name="date" />

          <input type="submit" value="Submit" />
        </form>
    </Dialog>
    );
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
                <Button variant="outlined" onClick={handleClickOpen}>
                  Filters
                </Button>
                <SimpleDialog
                  selectedValue={selectedValue}
                  open={open}
                  onClose={handleClose}
                />
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
              let monthRequestDate = "";
              let dayRequestDate = "";
              let yearRequestDate = "";
              let concatRequestDate = "";
              monthRequestDate = q.getMonth() + 1;
              dayRequestDate = q.getDate() + 1;
              yearRequestDate = q.getFullYear() + 1;
              concatRequestDate = yearRequestDate + "-" + monthRequestDate + "-" + dayRequestDate;

              let c = new Date(val.CompletedDate);
              let monthCompletedDate = "";
              let dayCompletedDate = "";
              let yearCompletedDate = "";
              let concatCompletedDate = "";
              monthCompletedDate = c.getMonth() + 1;
              dayCompletedDate = c.getDate() + 1;
              yearCompletedDate = c.getFullYear() + 1;
              concatCompletedDate = yearCompletedDate + "-" + monthCompletedDate + "-" + dayCompletedDate;
              return (
                <tr>
                  <td>{val.Name}</td>
                  <td>{concatRequestDate}</td>
                  <td>{concatCompletedDate}</td>
                  <td>{val.DeliveryMethod}</td>
                  <td>{val.Comments}</td>
                  <td>{val.status}</td>
                  <td>
                    <button onClick={() => handleRemove(val.Order_id)}>Delete</button>
                    <button onClick={() => handleEdit(val.Order_id)}>Edit</button>
                    <button onClick={() => handleView(val.Order_id)}>View</button>
                  </td>
                </tr>);
            })}
          </tbody>
        </table>
      </div>
    
  );
}

export default Distribution;



