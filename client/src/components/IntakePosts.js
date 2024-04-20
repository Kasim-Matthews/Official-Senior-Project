import React from "react";

const IntakePosts = ({ posts, handleView, handleEdit, handleRemove }) => {
    const total = posts.reduce((sum, val) => sum + parseFloat(val.total), 0);
    const totalQuantity = posts.reduce((sum, val) => sum + parseInt(val.totalitems), 0);
    return (
        <table>
            <thead>
                <tr>
                    <th>Partner</th>
                    <th>Issued on</th>
                    <th>Comments</th>
                    <th>Quantity of Items</th>
                    <th>Money Raised</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((val) => {
                    return (
                        <tr>
                            <td>{val.Name}</td>
                            <td>{val.RecievedDate}</td>
                            <td>{val.Comments}</td>
                            <td>{val.totalIitems}</td>
                            <td>${val.total}</td>
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
                    <td></td>
                    <td>{totalQuantity}</td>
                    <td>${total}</td>
                </tr>
            </tfoot>
        </table>
    )
}

export default IntakePosts;