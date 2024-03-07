import React from "react";
import {Page, Document, Image, StyleSheet} from "@react-pdf/renderer"
import PDFInfo from "./PDFInfo";
import PDFTable from "./PDFTable";

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft:60,
        paddingRight:60,
        lineHeight: 1.5,
        flexDirection: 'column',
    }, 
});

const PDF = ({record, itemList}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <PDFInfo record={record}></PDFInfo>
            <PDFTable itemList={itemList}></PDFTable>
        </Page>
    </Document>
);

export default PDF