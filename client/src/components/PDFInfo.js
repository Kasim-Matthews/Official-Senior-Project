import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        marginTop: 36,
        justifyContent: 'flex-end'
    },
    primaryContact: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    partner: {
        fontSize: 12,
    },
    label: {
        width: 60,
        fontStyle: 'bold'
    },
    labelPrimary: {
        width: 200,
        fontStyle: 'bold'
    },
    headerContainer: {
        marginTop: 36
    },

});

const PDFInfo = ({ record }) => (
    <Fragment>
        <View style={styles.Container}>
            <Text style={styles.labelPrimary}>Total Distributed to Partner:</Text>
            <Text>{record.PartnerTotal}</Text>
        </View>

        <View style={styles.primaryContact}>
            <Text style={styles.label}>Issued on:</Text>
            <Text>{record.CompletedDate}</Text>
        </View>

        <View style={styles.headerContainer}>
            <Text style={styles.label}>Issued To:</Text>
            <Text style={styles.partner}>{record.Partner}</Text>
            <Text style={styles.label}>Comments:</Text>
            <Text>{record.Comments}</Text>
        </View>
    </Fragment>
);

export default PDFInfo

