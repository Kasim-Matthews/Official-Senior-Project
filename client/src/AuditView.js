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


    const [state, setState] = React.useState([{
        startDate: new Date(),
        endDate: addDays(new Date(), 30),
        key: 'selection'
    }])

    useEffect(() => {
        Axios.get("http://localhost:3306/audit").then((response) => {
            setAuditList(response.data);
            setRecords(response.data);
        })
    }, [])


    const handleView = (id) => {
        navigate(`/audit/${id}`)
    }


    function handleSubmit(e) {
        e.preventDefault();
        var temp = auditList;


        if (state != null) {
            temp = temp.filter(f => new Date(f.Date) >= state[0].startDate && new Date(f.Date) <= state[0].endDate)
        }


        setRecords(temp);
    }

    return (
        <div>

            <form onSubmit={handleSubmit}>


                <DateRangePicker onChange={item => setState([item.selection])} ranges={state} months={2} showSelectionPreview={true} />



                <input type="submit" value="Filter" />
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
                                <td>{val.Date}</td>
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