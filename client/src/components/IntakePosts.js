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
                            <td>{new Date(val.RecievedDate).toISOString().slice(0, 10)/*console.log(new Date("2020/04/30").toLocaleDateString('en-US', {timeZone: 'America/New_York'})) */}</td>
                            {val.Comments == null || val.Comments == "undefined" ? <td></td>: <td>{val.Comments}</td>}
                            
                            <td>{val.totalitems}</td>
                            <td>${val.total}</td>
                            <td>
                                <button onClick={() => handleRemove(val.Intake_id, val.Name)}>Delete</button>
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