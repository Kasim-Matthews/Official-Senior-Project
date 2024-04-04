import React from "react";

const OrderPosts = ({ posts, handleView, handleEdit, handleComplete, handleIncomplete, handleRemove, handleprint }) => {
    const total = posts.reduce((sum, val) => sum + parseInt(val.Total), 0);
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Partner</th>
                        <th>Source Location</th>
                        <th>Completed Date</th>
                        <th>Total Items</th>
                        <th>Delivery Method</th>
                        <th>Comments</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((val) => {

                        return (
                            <tr>
                                <td>{val.Name}</td>
                                <td>{val.Location}</td>
                                <td>{val.CompletedDate}</td>
                                <td>{val.Total}</td>
                                <td>{val.DeliveryMethod}</td>
                                <td>{val.Comments}</td>
                                <td>{val.Status}</td>

                                <td>
                                    <button onClick={() => handleRemove(val.Order_id)}>Reclaim</button>
                                    <button onClick={() => handleprint(val.Order_id)}>Print</button>
                                    {val.Status == 'Draft' ? (<button onClick={() => handleEdit(val.Order_id)}>Edit</button>) : null}
                                    <button onClick={() => handleView(val.Order_id)}>View</button>
                                    {val.Status == 'Draft' ? (<button onClick={() => handleComplete(val.Order_id)}>Complete</button>) : null}
                                    {val.Status == 'Submitted' ? (<button onClick={() => handleIncomplete(val.Order_id)}>Uncomplete</button>) : null}

                                </td>
                            </tr>);
                    })}
                </tbody>

                <tfoot>
                    <tr>
                        <th>Total</th>
                        <td></td>
                        <td></td>
                        <td>{total}</td>
                    </tr>
                </tfoot>
            </table>

        </div>
    )
}

export default OrderPosts
