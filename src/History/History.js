import React from "react";

const history=(props)=> {
    return (
        <div>
            <h1>History:</h1>
            <p>Deleted:{props.history.deleted}</p>
            <p>Completed:{props.history.completed}</p>
            <p>Created:{props.history.created}</p>
        </div>
    )
};

export default history;
