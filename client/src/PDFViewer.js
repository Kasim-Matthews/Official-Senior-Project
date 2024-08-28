import React, { useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PDFFile from "./components/PDFFile";

const PDFView = () => {
    return(
        <PDFViewer>
            <PDFFile/>
        </PDFViewer>
    )
}

export default PDFView
