import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter } from '@mui/material';
import Button from '@mui/material/Button';

function Manufacturers() {
    const navigate = useNavigate();

    const [manuList, setManuList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/manufacturers`).then((response) => {
            if (response.data.status === 'complete') {
                setManuList(response.data.data);
                setRecords(response.data.data.filter(function (currentObject) {
                    return typeof (currentObject.DeletedAt) == "object";
                }))
            }

            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query")
                console.error(response.data.message)
            }
        }).catch(error => {
            navigate('/error')
            console.error(error)
        })
    }, [])


    const handleRemove = async (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the manufacturer list?`) == true) {
            let date = new Date().toLocaleDateString();
            try {
                await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/manufacturers/remove/${id}`, { date: date }).then((response) => {

                    if (response.status == 400) {
                        alert("Contact developer")
                    }

                    else if (response.status == 200) {
                        window.location.reload(false);
                    }
                })


            }
            catch (error) {
                alert("Server side error/Contact developer")
            }
        }

    }

    const handleReactivate = async (id, Name) => {
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the manufacturer list?`) == true) {
            try {
                await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/manufacturers/reactivate/${id}`).then((response) => {

                    if (response.status == 400) {
                        alert("Contact developer")
                    }

                    else if (response.status == 200) {
                        window.location.reload(false);
                    }
                })

            }
            catch (error) {
                alert("Server side error/Contact developer")
            }
        }
    }

    const handleEdit = (id) => {
        navigate(`/manufacturers/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/manufacturers/${id}`)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = manuList;

        if (nonActive) {
            setRecords(temp)
        }

        else {
            setRecords(temp.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        }
    }


    if (records.length == 0) {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex" }}>

                        <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                        <label htmlFor="non-active" >Also include inactive items</label>

                    </div>
                    <input type="Submit" />
                </form>

                <button><Link to="/manufacturers/new">Add</Link></button>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Total Items</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }
    else {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex" }}>

                        <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                        <label htmlFor="non-active" >Also include inactive Manufacturers</label>

                    </div>
                    <input type="Submit" />
                </form>

                <button><Link to="/manufacturers/new">Add</Link></button>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Total Items</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((val) => {
                            return (
                                <tr>
                                    <td>{val.Name}</td>
                                    {val.TotalItems == null ? <td>0</td>:<td>{val.TotalItems}</td>}
                                    <td>
                                        {typeof val.DeletedAt == "object" ? <button onClick={() => handleRemove(val.Partner_id, val.Name)}>Delete</button> : <button onClick={() => handleReactivate(val.Partner_id, val.Name)}>Reactivate</button>}
                                        <button onClick={() => handleEdit(val.Partner_id)}>Edit</button>
                                        <button onClick={() => handleView(val.Partner_id)}>View</button>
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

    // return(
    //     <div>
    //         <TableContainer component={Paper}>
    //         <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //             <TableHead>
    //                 <TableRow>
    //                     <TableCell>Name</TableCell>
    //                     <TableCell>Market Value</TableCell>
    //                     <TableCell>Actions</TableCell>
    //                 </TableRow>
    //             </TableHead>
    //             <TableBody>
    //                 {manuList.map((val) => {
    //                     return (
    //                         <TableRow>
    //                             <TableCell>{val.Name}</TableCell>
    //                             <TableCell>0</TableCell>
    //                             <TableCell>
    //                                 <Button varaint="outlined" onClick={() => handleRemove(val.id)}>Delete</Button>
    //                                 <Button varaint="outlined" onClick={() => handleEdit(val.id)}>Edit</Button>
    //                             </TableCell>
    //                         </TableRow>
    //                     );
    //                 })}
    //             </TableBody>
    //         </Table>
    //         </TableContainer>
    //     </div>
    // );
}

export default Manufacturers;