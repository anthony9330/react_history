import './App.css';
import React, {useState, useEffect} from 'react';
import Spinner from "./Spinner/Spinner";
import Item from "./Item/Items"
import axios from 'axios';
import Button from '@material-ui/core/Button';


function App() {
    const [items, setItems] = useState({
        list: [
            {
                id: 1,
                text: 'first in todo',
                completed: true,

            },
            {
                id: 2,
                text: 'wash a car',
                completed: false,

            },
            {
                id: 3,
                text: 'do a homework',
                completed: false,

            },
            {
                id: 4,
                text: 'finish review',
                completed: false,

            }
        ]
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

    function onCompleteHandler(itemId) {
        const itemIndex = items.list.findIndex((item) => item.id === itemId);
        const item = {...items.list[itemIndex]};
        item.completed = true;

        const updatedItems = [...items.list];
        updatedItems[itemIndex] = item;
        setItems({list: updatedItems});
        const historyCopy = {
            ...history,
            completed: history.completed + 1
        };
        setHistory(historyCopy);
    }

    function onDeleteHandler(id) {

    }

    function onSaveToDo() {
        if (textInput.current.value === "" || textInput.current.value === null) {
            return;
        }
        const newList = [...items.list];
        const newItem = {
            id: Math.random(),
            text: textInput.current.value,
            completed: false
        };

        newList.unshift(newItem);
        setItems({list: newList});
        textInput.current.value = null;

        const historyCopy = {
            ...history,
            created: history.created + 1
        };

        setHistory(historyCopy);

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
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts/');
            console.log(response);
        })()

    },[]);


    let list = [];
    list = items.list.map(item => {
        return <Item text={item.text}
                     key={item.id}
                     completed={item.completed}
                     onComplete={() => onCompleteHandler(item.id)}
                     onDelete={() => onDeleteHandler(item.id)}/>
    });


    return (
        <div className="App">
            <section className="History">
                <h1>History:</h1>
                <p>Deleted:{history.deleted}</p>
                <p>Completed:{history.completed}</p>
                <p>Created:{history.created}</p>
            </section>
            <section className="CreateNew">
                <input type="text" ref={textInput} onKeyDown={(event) => onHandleKeyDown(event)}
                       placeholder="Add new"/>
                <Button color='default' onClick={onSaveToDo.bind(this)}>Save</Button>
            </section>
            <section className="list" style={listStyle}>
                <ul>
                    {list}
                </ul>
            </section>
        </div>
    );
}

export default App;
