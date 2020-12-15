import React from 'react';
import './Item.css';
import IconButton from '@material-ui/core/IconButton'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const item = (props) => {

    const btnStyle = {
        float: 'right'
    };
    return (
        <li className={`Item ${props.completed ? "Completed" : ""}`}>
            <div className="ItemText" onClick={props.onComplete}>{props.text}</div>
            {/*<button style={btnStyle} onClick={props.onComplete}> Complete</button>*/}
            <IconButton style={btnStyle} onClick={props.onDelete}> <DeleteForeverIcon/></IconButton>
        </li>

    )
};


export default item;
