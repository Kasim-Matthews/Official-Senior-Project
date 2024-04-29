import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#90e5fc'

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    item: {
        width: '40%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    value: {
        width: '30%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    qty: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    inkindValue: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
});

const PDFTableRow = ({ itemList }) => {
    const rows = itemList.map(item => {
        if (item.PackageCount != null || item.PackageCount != 0) {
            return (
                <View style={styles.row}>
                    <Text style={styles.item}>{item.Item}</Text>
                    <Text style={styles.value}>{item.FairMarketValue}</Text>
                    <Text style={styles.qty}>{item.Quantity}</Text>
                    <Text style={styles.inkindValue}>{Math.round((item.FairMarketValue * item.Quantity) * 10) / 10}</Text>
                    <Text style={styles.inkindValue}>{item.Quantity / item.PackageCount}</Text>
                </View>
            )
        }
        else {
            return (
                <View style={styles.row}>
                    <Text style={styles.item}>{item.Item}</Text>
                    <Text style={styles.value}>{item.FairMarketValue}</Text>
                    <Text style={styles.qty}>{item.Quantity}</Text>
                    <Text style={styles.inkindValue}>{Math.round((item.FairMarketValue * item.Quantity) * 10) / 10}</Text>
                    <Text style={styles.inkindValue}></Text>
                </View>
            )
        }
    });
    return (<Fragment>{rows}</Fragment>);
}

export default PDFTableRow;