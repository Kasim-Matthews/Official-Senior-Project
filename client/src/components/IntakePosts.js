import React from "react";

const IntakePosts = ({posts, handleView, handleEdit, handleRemove}) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Partner</th>
                    <th>Value</th>
                    <th>Recieved Date</th>
                    <th>Comments</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((val) => {
                    return (
                        <tr>
                            <td>{val.Name}</td>
                            <td>${val.Total}</td>
                            <td>{val.RecievedDate}</td>
                            <td>{val.Comments}</td>
                            <td>
                                <button onClick={() => handleRemove(val.Intake_id)}>Delete</button>
                                <button onClick={() => handleEdit(val.Intake_id)}>Edit</button>
                                <button onClick={() => handleView(val.Intake_id)}>View</button>
                            </td>

                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}

export default IntakePosts;