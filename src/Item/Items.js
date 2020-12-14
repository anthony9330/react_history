import React from 'react';
import './Item.css';
const item = (props) => {

    const btnStyle = {
        float: 'right'
    };
    return (
    <li  className={`Item ${props.completed ? "Completed" : ""}`}>
            {props.text}
            <button style={btnStyle} onClick={props.onComplete}> Complete</button>
            <button style={btnStyle} onClick={props.onDelete}> Delete</button>
        </li>

    )
};


export default item;
