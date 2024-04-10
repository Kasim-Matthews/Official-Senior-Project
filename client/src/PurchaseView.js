import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import PurchasePosts from "./components/PurchasePosts";
import Pagination from "./components/Pagination";
import ErrorHandler from "./ErrorHandler";


function Purchase() {
    const navigate = useNavigate();


    const [partners, setPartners] = React.useState([])
    const [locations, setLocations] = React.useState([])
    const [intakeList, setIntakeList] = React.useState([])
    const [records, setRecords] = React.useState([])

    const [filters, setFilters] = React.useState({
        Vendor: "",
        Location: "",
        Date: ""

    })



    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(10);

    //Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = records.slice(indexOfFirstPost, indexOfLastPost)

    useEffect(() => {
        Axios.get("http://localhost:3306/purchase").then((response) => {
            setIntakeList(response.data);
            setRecords(response.data)
        })
    }, [])

    const paginate = pageNumber => setCurrentPage(pageNumber);




    const handleRemove = async (id) => {
        let GetData = async function (id) {
            return await Axios.get(`http://localhost:3306/purchase/${id}/cleanup`).then((response) => {
                return response
            });
        }
        let data = GetData(id)
        data.then(async (response) => {
            await Axios.put("http://localhost:3306/purchase/reclaim", { records: response.data })
        })

        await Axios.delete(`http://localhost:3306/purchase/remove/${id}`);

        window.location.reload(false);


    }

    const handleEdit = (id) => {
        navigate(`/purchase/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/purchase/${id}`)
    }

    useEffect(() => {
        Axios.get("http://localhost:3306/vendor/list").then((response) => {
            if (response.data.status === 'complete') {
                setPartners(response.data.data);
            }

            else if (response.data.status === 'error in query'){
                navigate('/query')
                console.error("Fail in the query loading vendor options for the filter")
                console.error(response.data.message)
            }
        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3306/location/use").then((response) => {
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

    function clearFilters(e) {
        e.preventDefault();

        setFilters({
            Vendor: "",
            Location: "",
            Date: ""
        })
        setRecords(intakeList)
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


        if (filters.Date != "") {
            temp = temp.filter(f => new Date(f.RecievedDate) >= new Date(filters.Date))
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

                <label>
                    Date Range
                    <input type="date" name="Date" value={filters.Date} onChange={handleChange} />
                </label>



                <input type="submit" value="Filter" />
                <button onClick={clearFilters}>Clear</button>


            </form>

            <button><Link to="/purchase/new">Add</Link></button>

            <PurchasePosts posts={currentPosts} handleView={handleView} handleEdit={handleEdit} handleRemove={handleRemove} />
            <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />

            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default Purchase;