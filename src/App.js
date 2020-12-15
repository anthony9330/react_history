import './App.css';
import React, {useState, useEffect} from 'react';
import { StylesProvider } from "@material-ui/core/styles";
import Spinner from "./Spinner/Spinner";
import Item from "./Item/Items"
import History from './History/History';
import Create from './Create/Create';
import axios from 'axios';
import Button from '@material-ui/core/Button';


function App() {
    const [items, setItems] = useState({
        list: []
    });

    const [history, setHistory] = useState({
        created: 0,
        completed: 0,
        deleted: 0
    });

    // state to rerender loaded items
    const [dataLoaded, setDataLoad] = useState(false);


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

    function onRemoveAll() {
        const nItems = items.list.length;
        setItems({list: []});
        const copiedHistory = {...history, deleted: history.deleted + nItems};
        setHistory(copiedHistory);
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('/list');
                setItems({list: response.data});
                const history = await axios.get('/history');
                setHistory(history.data);
                setDataLoad(true);
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

    if (dataLoaded) {
        return (
            <StylesProvider injectFirst>
            <div className="App">
                <section className="History">
                    <History history={history}/>
                </section>
                <section className="Content">
                    <div className="CreateNew">
                        <Create items={items} setItemsFn={setItems} history={history} setHistoryFn={setHistory}/>
                    </div>
                    {
                        items.list.length > 0 ? (
                            <div className="List">
                                <div className="RemoveAllWrapper">
                                    <Button className="AppButton FullWidth RemoveButton" onClick={() => onRemoveAll()}>Remove all</Button>
                                </div>

                                <ul>
                                    {list}
                                </ul>
                            </div>) : (<h2>There are no todos yet</h2>)}
                </section>

            </div>
            </StylesProvider>
        );
    } else {
        return (
            <Spinner/>
        )
    }

}

export default App;
