import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

function AuditView() {
    const navigate = useNavigate();


    const [auditList, setAuditList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [filters, setFilters] = React.useState({
        Date: ""

    })




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
            Date: ""
        })
        setRecords(auditList)
    }


    function handleSubmit(e) {
        e.preventDefault();
        var temp = auditList;


        if (filters.Date != "") {
            temp = temp.filter(f => new Date(f.Date) > new Date(filters.Date))
        }


        setRecords(temp);
    }

    return (
        <div>

            <form onSubmit={handleSubmit}>

                <label>
                    Date Range
                    <input type="date" name="Date" value={filters.Date} onChange={handleChange} />
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
                    {records.map((val) => {
                        return (
                            <tr>
                                <td>{new Date(val.Date).toLocaleDateString('en-US', {timeZone: 'America/New_York'})}</td>
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
        </div>
    );
}

export default AuditView;