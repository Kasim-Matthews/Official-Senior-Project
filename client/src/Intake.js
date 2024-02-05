import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import IntakePosts from "./components/IntakePosts";
import Pagination from "./components/Pagination";

function Intake() {
    const navigate = useNavigate();

    const [intakeList, setIntakeList] = React.useState([])
    const [records, setRecords] = React.useState([])

    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(1);

    //Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = records.slice(indexOfFirstPost, indexOfLastPost)

    useEffect(() => {
        Axios.get("http://localhost:3001/intake").then((response) => {
            setIntakeList(response.data);
            setRecords(response.data)
        })
    }, [])

    const paginate = pageNumber => setCurrentPage(pageNumber);




    /*const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3001/partner/remove/${id}`);
    }*/

    const handleEdit = (id) => {
        navigate(`/intake/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/intake/${id}`)
    }



    return (
        <div>
            <button><Link to="/intake/new">Add</Link></button>

            <IntakePosts posts={currentPosts} handleView={handleView} handleEdit={handleEdit} />
            <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />

            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default Intake;