import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Pagination from "./components/Pagination";

function AuditView() {
    const navigate = useNavigate();


    const [auditList, setAuditList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [filters, setFilters] = React.useState({
        Date: {start:"",
            end:""
        }

    })

    const paginate = pageNumber => setCurrentPage(pageNumber);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(3);

    //Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = records.slice(indexOfFirstPost, indexOfLastPost)


    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/audit`).then((response) => {
            if (response.data.status === 'complete') {
                setAuditList(response.data.data);
                setRecords(response.data.data);
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


    const handleView = (id) => {
        navigate(`/audit/${id}`)
    }

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
            Date: {start:"", end:""}
        })
        setRecords(auditList)
    }


    function handleSubmit(e) {
        e.preventDefault();
        var temp = auditList;

        console.log(filters)

        if (filters.Date.start != "" && filters.Date.end == "") {
            temp = temp.filter(f => new Date(f.Date) >= new Date(filters.Date.start))
        }
        if (filters.Date.end != "" && filters.Date.start == "") {
            temp = temp.filter(f => new Date(f.Date) <= new Date(filters.Date.end))
        }
        if (filters.Date.start != "" && filters.Date.end != "") {
            temp = temp.filter(f => (new Date(f.Date) >= new Date(filters.Date)) && (new Date(f.Date) <= new Date(filters.Date.end)))
        }


        setRecords(temp);
    }

    return (
        <div>

            <form onSubmit={handleSubmit}>

                <label>
                    Date Range
                    <div>
                    <input type="date" name="Date.start" value={filters.Date.start} onChange={handleChange} />
                    -
                    <input type="date" name="Date.end" value={filters.Date.end} onChange={(event) => filters.Date.end = event.target.value} />
                    </div>
                </label>



                <input type="submit" value="Filter" />
                <button onClick={clearFilters}>Clear</button>
            </form>
            <button><Link to="/audit/new">Add</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Inventory Affected</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPosts.map((val) => {
                        return (
                            <tr>
                                <td>{new Date(val.Date).toISOString().slice(0, 10)}</td>
                                <td>{val.Affected}</td>
                                <td>
                                    <button onClick={() => handleView(val.Audit_id)}>View</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
            <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />
        </div>
    );
}

export default AuditView;