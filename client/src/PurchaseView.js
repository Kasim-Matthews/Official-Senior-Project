import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import PurchasePosts from "./components/PurchasePosts";
import Pagination from "./components/Pagination";
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

function Purchase() {
    const navigate = useNavigate();

    
    const [partners, setPartners] = React.useState([])
    const [locations, setLocations] = React.useState([])
    const [intakeList, setIntakeList] = React.useState([])
    const [records, setRecords] = React.useState([])

    const [filters, setFilters] = React.useState({
        Vendor: 0,
        Location: "",

    })

    const [state, setState] = React.useState([{
        startDate: new Date(),
        endDate: addDays(new Date(), 30),
        key: 'selection'
    }])

    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(1);

    //Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = records.slice(0, indexOfLastPost)

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/purchase").then((response) => {
            setIntakeList(response.data);
            setRecords(response.data)
        })
    }, [])

    const paginate = pageNumber => setCurrentPage(pageNumber);




    const handleRemove = async (id) => {
        let GetData = async function (id) {
            return await Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/purchase/${id}/cleanup`).then((response) => {
                return response
            });
        }
        let data = GetData(id)
        data.then(async (response) => {
            await Axios.put("https://diaper-bank-inventory-management-system.onrender.com/purchase/reclaim", { records: response.data })
        })

        await Axios.delete(`https://diaper-bank-inventory-management-system.onrender.com/purchase/remove/${id}`);

        window.location.reload(false);


    }

    const handleEdit = (id) => {
        navigate(`/purchase/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/purchase/${id}`)
    }

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/vendor/list").then((response) => {
          setPartners(response.data);
        })
      }, [])

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/location").then((response) => {
            setLocations(response.data);
        })
    }, [])

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
        var temp = intakeList;

        if (filters.Vendor != "") {
            temp = temp.filter(f => f.Name == filters.Vendor);
        }

        if (filters.Location != "") {
            temp = temp.filter(f => f.Location == filters.Location);
        }


        if (state != null) {
            temp = temp.filter(f => new Date(f.RecievedDate) >= state[0].startDate && new Date(f.RecievedDate) <= state[0].endDate)
        }


        setRecords(temp);
    }



    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Vendor">
                    Vendor
                    <select id="Vendor" name="Vendor" value={filters.Vendor} onChange={handleChange}>
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

                <DateRangePicker onChange={item => setState([item.selection])} ranges={state} months={2} showSelectionPreview={true} />



                <input type="submit" value="Filter" />
            </form>
            
            <button><Link to="/purchase/new">Add</Link></button>

            <PurchasePosts posts={currentPosts} handleView={handleView} handleEdit={handleEdit} handleRemove={handleRemove} />
            <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />

            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default Purchase;