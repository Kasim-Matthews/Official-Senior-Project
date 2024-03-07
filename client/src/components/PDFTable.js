import React from "react";
import {View, StyleSheet } from "@react-pdf/renderer";
import PDFTableHeader from "./PDFTableHeader";
import PDFTableRow from "./PDFTableRow";

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#bff0fd',
    },
});

const PDFTable = ({itemList}) =>(
    
    
    <View style={styles.tableContainer}>
        <PDFTableHeader />
        <PDFTableRow itemList={itemList} />
    </View>
) ;
export default PDFTable