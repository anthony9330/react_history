import './App.css';
import React, {useState, useEffect} from 'react';
import Spinner from "./Spinner/Spinner";
import Item from "./Item/Items"
import axios from 'axios';
import Button from '@material-ui/core/Button';


function App() {
    const [items, setItems] = useState({
        list: null
    });

    const [history, setHistory] = useState({
        created: 0,
        completed: 0,
        deleted: 0
    });

    const textInput = React.createRef();

    const listStyle = {
        margin: "auto",
        width: "400px"
    };
    let errorText = null;

    async function onCompleteHandler(itemId) {
        const itemIndex = items.list.findIndex((item) => item.id === itemId);
        const item = {...items.list[itemIndex]};
        item.completed = true;

        const updatedItems = [...items.list];
        updatedItems[itemIndex] = item;

        const responseList = await axios.post("/list", updatedItems).catch(e => e);
        if (responseList.data) {
            setItems({list: responseList.data});
            const historyCopy = {
                ...history,
                completed: history.completed + 1
            };
            setHistory(historyCopy);
        }

    }

    async function onDeleteHandler(itemId) {
        const itemIndex = items.list.findIndex((item) => item.id === itemId);
        const copiedItems = [...items.list];
        const deletedElement = copiedItems.splice(itemIndex, 1);
        const resDelete = await axios.delete("/list/1").catch(e => e);
        // there is no data for delete so let's just simultae it
        // like in all other places
        if (resDelete) {
            setItems({list: copiedItems});
            const historyCopy = {
                ...history,
                deleted: history.deleted + 1
            };
            setHistory(historyCopy);

        }
        console.log(deletedElement);
    }

    async function onSaveToDo() {
        if (textInput.current.value === "" || textInput.current.value === null) {
            return;
        }
        const newList = [...items.list];
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
            setItems({list: newList});

            // update history only in case if no errors
            const historyCopy = {
                ...history,
                created: history.created + 1
            };
            const responseHistory = await axios.post("/history", historyCopy).catch(e => e);
            if (responseHistory.data) {
                setHistory(historyCopy);
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

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('/list');
                setItems({list: response.data});
                const history = await axios.get('/history');
                setHistory(history.data);
            } catch (e) {
                // errorText = "Something went wrong";
                console.log(e);
            }

        })()

    }, []);


    let list;
    if (items.list) {
        list = items.list.map(item => {
            return <Item text={item.text}
                         key={item.id}
                         completed={item.completed}
                         onComplete={() => onCompleteHandler(item.id)}
                         onDelete={() => onDeleteHandler(item.id)}/>
        });
    }


    return (
        <div className="App">
            <h2>{errorText}</h2>
            <section className="History">
                <h1>History:</h1>
                <p>Deleted:{history.deleted}</p>
                <p>Completed:{history.completed}</p>
                <p>Created:{history.created}</p>
            </section>
            <section className="CreateNew">
                <input type="text" ref={textInput} onKeyDown={(event) => onHandleKeyDown(event)}
                       placeholder="Add new"/>
                <Button color='default' onClick={() => onSaveToDo()}>Save</Button>
            </section>
            {
                items.list ? (
                    <section className="list" style={listStyle}>
                        <ul>
                            {list}
                        </ul>
                    </section>) : (<Spinner/>)}
        </div>
    );
}

export default App;
