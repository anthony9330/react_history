import Button from "@material-ui/core/Button";
import React from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import './Create.css'


const create = (props) => {
    const textInput = React.createRef();

    async function onSaveToDo() {
        if (textInput.current.value === "" || textInput.current.value === null) {
            return;
        }
        const newList = [...props.items.list];
        const newItem = {
            id: Math.random(),
            text: textInput.current.value,
            completed: false
        };


        // since there is no possibility to handle POST,/
        // let's consider that in case if everything is ok (no errors thrown),
        // code will continue executing, and state will be updated with new value {/list/:id}

        const response = await axios.post("/list", newItem).catch(e => e);
        const returnedItem = response.data;
        if (returnedItem) {
            newList.unshift(response.data);
            props.setItemsFn({list: newList});

            // update history only in case if no errors
            const historyCopy = {
                ...props.history,
                created: props.history.created + 1
            };
            const responseHistory = await axios.post("/history", historyCopy).catch(e => e);
            if (responseHistory.data) {
                props.setHistoryFn(historyCopy);
            }
        }


        if (textInput.current) {
            textInput.current.value = null
        }
    }

    function onHandleKeyDown(e) {
        if (e.key === 'Enter') {
            textInput.current.value = e.target.value;
            onSaveToDo();
            textInput.current.value = null;
        }
    }

    return (
        <div className="CrateComponent">
            <TextField
                inputRef={textInput}
                onKeyDown={(event) => onHandleKeyDown(event)}
                size="small"
                id="outlined-basic"
                label="Create new todo"
                variant="outlined"/>
            <Button className="AppButton CustomButton"  onClick={() => onSaveToDo()}>Save</Button>
        </div>
    )
};

export default create;
