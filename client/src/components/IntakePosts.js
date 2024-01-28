import React from "react";

const IntakePosts = ({posts, handleView, handleEdit}) => {
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
                    let q = new Date(val.RecievedDate);
                    let monthRecievedDate = ""
                    let dayRecievedDate = ""
                    let yearRecievedDate = ""
                    let concatRecievedDate = ""
                    monthRecievedDate = q.getMonth() + 1
                    dayRecievedDate = q.getDate() + 1
                    yearRecievedDate = q.getFullYear() + 1
                    concatRecievedDate = yearRecievedDate + "-" + monthRecievedDate + "-" + dayRecievedDate
                    return (

                        <tr>
                            <td>{val.Name}</td>
                            <td>{val.Value}</td>
                            <td>{concatRecievedDate}</td>
                            <td>{val.Comments}</td>
                            <td>
                                <button /*onClick={() => handleRemove(val.Intake_id)}*/>Delete</button>
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