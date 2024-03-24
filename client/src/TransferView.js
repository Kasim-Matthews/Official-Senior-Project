import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

function TransferView() {
    const navigate = useNavigate();

    const [partners, setPartners] = React.useState([])
    const [locations, setLocations] = React.useState([])

    const [transferList, setTransferList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [filters, setFilters] = React.useState({
        From: "",
        To: "",

    })

    const [state, setState] = React.useState([{
        startDate: new Date(),
        endDate: addDays(new Date(), 30),
        key: 'selection'
    }])

    useEffect(() => {
        Axios.get("http://localhost:3001/transfer").then((response) => {
            setTransferList(response.data);
            setRecords(response.data);
        })
    }, [])

    const handleRemove = async (id, Name, Location) => {
        if (window.confirm(`Are you sure you want to delete ${Name}'s transfer from the transfer list?`) == true) {
            let GetData = async function (id) {
                return await Axios.get(`http://localhost:3001/transfer/${id}/cleanup`).then((response) => {
                    return response
                });
            }
            let data = GetData(id)
            data.then(async (response) => {
                await Axios.put("http://localhost:3001/transfer/reclaim", { records: response.data })
                await Axios.put("http://localhost:3001/transfer/renounce", { records: response.data, Location: Location })
            })

            await Axios.delete(`http://localhost:3001/intake/remove/${id}`);

            window.location.reload(false);
        }
    }

    const handleView = (id) => {
        navigate(`/transfer/${id}`)
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/transfer/adjustment").then((response) => {
            setPartners(response.data);
        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3001/location").then((response) => {
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
        var temp = transferList;

        if (filters.From != "") {
            temp = temp.filter(f => f.Taken == filters.From);
        }

        if (filters.To != "") {
            temp = temp.filter(f => f.Given == filters.To);
        }


        if (state != null) {
            temp = temp.filter(f => new Date(f.Date) >= state[0].startDate && new Date(f.Date) <= state[0].endDate)
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

                <DateRangePicker onChange={item => setState([item.selection])} ranges={state} months={2} showSelectionPreview={true} />



                <input type="submit" value="Filter" />
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
                                    <button onClick={() => handleView(val.Intake_id)}>Edit</button>
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