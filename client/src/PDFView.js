import React, { Fragment, useEffect } from 'react';
import {PDFViewer} from '@react-pdf/renderer'
import PDF from './components/PDF'
import Axios from 'axios';
import { useParams } from "react-router-dom";

function PDFView() {
    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [itemList, setItemList] = React.useState([])

    useEffect(() => {
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/distribution/${id}/print`).then((response) => {
            setRecord(response.data.data[0])
        });
    }, [])

    useEffect(() => {
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/distribution/${id}/itemlist`).then((response) => {
            setItemList(response.data.data)
        });
    }, [])

    return(
        <Fragment>
            <PDFViewer width="100%" height="966">
                <PDF record={record} itemList={itemList}></PDF>
            </PDFViewer>
        </Fragment>
    )
}

export default PDFView;