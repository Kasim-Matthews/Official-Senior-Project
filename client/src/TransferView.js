import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";


function TransferView() {
    const navigate = useNavigate();

    const [partners, setPartners] = React.useState([])
    const [locations, setLocations] = React.useState([])

    const [transferList, setTransferList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [filters, setFilters] = React.useState({
        From: "",
        To: "",
        Date: ""

    })


    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/transfer").then((response) => {
            setTransferList(response.data.data);
            setRecords(response.data.data);
        })
    }, [])

    const handleRemove = async (id, Name, Location) => {
        if (window.confirm(`Are you sure you want to delete ${Name}'s transfer from the transfer list?`) == true) {
            let GetData = async function (id) {
                return await Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/transfer/${id}/cleanup`).then((response) => {
                    return response
                });
            }
            let data = GetData(id)
            data.then(async (response) => {
                await Axios.put("https://diaper-bank-inventory-management-system.onrender.com/transfer/reclaim", { records: response.data })
                await Axios.put("https://diaper-bank-inventory-management-system.onrender.com/transfer/renounce", { records: response.data, Location: Location })
            })

            await Axios.delete(`https://diaper-bank-inventory-management-system.onrender.com/intake/remove/${id}`);

            window.location.reload(false);
        }
    }

    const handleView = (id) => {
        navigate(`/transfer/${id}`)
    }

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/transfer/adjustment").then((response) => {
            setPartners(response.data.data);
        })
    }, [])

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/location/use").then((response) => {
            setLocations(response.data.data);
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
            From: "",
            To: "",
            Date: ""
        })
        setRecords(transferList)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = transferList;

        if (filters.From != "") {
            temp = temp.filter(f => f.Taken == filters.From);
        }

        if (filters.To != "") {
            temp = temp.filter(f => f.Given == filters.To);
        }


        if (filters.Date != "") {
            temp = temp.filter(f => new Date(f.Date) >= new Date(filters.Date))
        }


        setRecords(temp);
    }

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="From">
                    From
                    <select id="From" name="From" value={filters.From} onChange={handleChange}>
                        <option value=""></option>
                        {partners.map((val) => {
                            return (
                                <option value={val.Name}>{val.Name}</option>
                            )
                        })}

                    </select>

                </label>

                <label htmlFor="To">
                    To
                    <select id="To" name="To" value={filters.To} onChange={handleChange}>
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
            <button><Link to="/transfer/new">Add</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Date</th>
                        <th>Comments</th>
                        <th>Total Moved</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((val) => {
                        return (
                            <tr>
                                <td>{val.Taken}</td>
                                <td>{val.Given}</td>
                                <td>{val.Date}</td>
                                <td>{val.Comments}</td>
                                <td>{val.TotalMoved}</td>
                                <td>
                                    <button onClick={() => handleRemove(val.Intake_id, val.Taken, val.Location)}>Delete</button>
                                    <button onClick={() => handleView(val.Intake_id)}>View</button>
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

export default TransferView;