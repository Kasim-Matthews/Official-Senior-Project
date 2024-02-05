import React from "react";

const OrderPosts = ({ posts, handleView, handleEdit, handleComplete, handleIncomplete }) => {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Partner</th>
                        <th>Requested Date</th>
                        <th>Completed Date</th>
                        <th>Delivery Method</th>
                        <th>Comments</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((val) => {
                        let q = new Date(val.RequestDate);
                        let monthRequestDate = ""
                        let dayRequestDate = ""
                        let yearRequestDate = ""
                        let concatRequestDate = ""
                        monthRequestDate = q.getMonth() + 1
                        dayRequestDate = q.getDate() + 1
                        yearRequestDate = q.getFullYear() + 1
                        concatRequestDate = yearRequestDate + "-" + monthRequestDate + "-" + dayRequestDate

                        let c = new Date(val.CompletedDate);
                        let monthCompletedDate = ""
                        let dayCompletedDate = ""
                        let yearCompletedDate = ""
                        let concatCompletedDate = ""
                        monthCompletedDate = c.getMonth() + 1
                        dayCompletedDate = c.getDate() + 1
                        yearCompletedDate = c.getFullYear() + 1
                        concatCompletedDate = yearCompletedDate + "-" + monthCompletedDate + "-" + dayCompletedDate
                        return (
                            <tr>
                                <td>{val.Name}</td>
                                <td>{concatRequestDate}</td>
                                <td>{concatCompletedDate}</td>
                                <td>{val.DeliveryMethod}</td>
                                <td>{val.Comments}</td>
                                <td>{val.Status}</td>

                                <td>
                                    <button /*onClick={() => handleRemove(val.Order_id)}*/>Delete</button>
                                    {val.Status == 'Draft' ? (<button onClick={() => handleEdit(val.Order_id)}>Edit</button>) : null}
                                    <button onClick={() => handleView(val.Order_id)}>View</button>
                                    {val.Status == 'Draft' ? (<button onClick={() => handleComplete(val.Order_id)}>Complete</button>) : null}
                                    {val.Status == 'Submitted' ? (<button onClick={() => handleIncomplete(val.Order_id)}>Uncomplete</button>) : null}

                                </td>
                            </tr>);
                    })}
                </tbody>
            </table>

        </div>
    )
}

export default OrderPosts
