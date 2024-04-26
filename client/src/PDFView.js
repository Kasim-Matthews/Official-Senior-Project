import React, { Fragment, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer'
import PDF from './components/PDF'
import Axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";

function PDFView() {
    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [itemList, setItemList] = React.useState([])
    const navigate = useNavigate()

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/print`).then((response) => {
            if (response.data.status === 'complete') {
                setRecord(response.data.data[0])
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

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/itemlist`).then((response) => {
            if (response.data.status === 'complete') {
                setItemList(response.data.data)
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

    return (
        <Fragment>
            <PDFViewer width="100%" height="966">
                <PDF record={record} itemList={itemList}></PDF>
            </PDFViewer>
        </Fragment>
    )
}

export default PDFView;