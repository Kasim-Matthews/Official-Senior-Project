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




    const handleRemove = async (id) => {
        let GetData = async function (id) {
            return await Axios.get(`http://localhost:3001/intake/${id}/cleanup`).then((response) => {
                return response
            });
        }
        let data = GetData(id)
        data.then(async (response) => {
            await Axios.put("http://localhost:3001/intake/reclaim", { records: response.data })
        })

        await Axios.delete(`http://localhost:3001/intake/remove/${id}`);

        window.location.reload(false);


    }

    const handleEdit = (id) => {
        navigate(`/intake/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/intake/${id}`)
    }



    return (
        <div>
            <button><Link to="/intake/new">Add</Link></button>

            <IntakePosts posts={currentPosts} handleView={handleView} handleEdit={handleEdit} handleRemove={handleRemove} />
            <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />

            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default Intake;