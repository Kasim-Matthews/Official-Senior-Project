import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#90e5fc'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        backgroundColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
    },
    item: {
        width: '40%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    value: {
        width: '30%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    qty: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    inkindValue: {
        width: '15%'
    },
});

const PDFTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.item}>Items Recieved</Text>
        <Text style={styles.value}>Value/item</Text>
        <Text style={styles.qty}>Quantity</Text>
        <Text style={styles.inkindValue}>In-Kind Value</Text>
        <Text style={styles.inkindValue}>Package Count</Text>
    </View>
);

export default PDFTableHeader;