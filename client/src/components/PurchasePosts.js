import React from "react";

const PurchasePosts = ({ posts, handleView, handleEdit, handleRemove }) => {
    const total = posts.reduce((sum, val) => sum + parseFloat(val.Total), 0);
    const totalQuantity = posts.reduce((sum, val) => sum + parseInt(val.TotalItems), 0);
    return (
        <table>
            <thead>
                <tr>
                    <th>Partner</th>
                    <th>Recieved Date</th>
                    <th>Total Items</th>
                    <th>Comments</th>
                    <th>Amount Spent</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((val) => {
                    return (
                        <tr>
                            <td>{val.Name}</td>
                            <td>{new Date(val.RecievedDate).toDateString()}</td>
                            <td>{val.TotalItems}</td>
                            <td>{val.Comments}</td>
                            <td>${val.TotalValue}</td>
                            <td>
                                <button onClick={() => handleRemove(val.Intake_id)}>Delete</button>
                                <button onClick={() => handleEdit(val.Intake_id)}>Edit</button>
                                <button onClick={() => handleView(val.Intake_id)}>View</button>
                            </td>

                        </tr>
                    );
                })}
            </tbody>

            <tfoot>
                <tr>
                    <th>Total</th>
                    <td></td>
                    <td>{totalQuantity}</td>
                    <td></td>
                    <td>${total}</td>
                </tr>
            </tfoot>
        </table>
    )
}

export default PurchasePosts;