import TaskList from "./TaskList";
import SettingsList from "./SettingsList";
import { useState, useEffect, useContext } from 'react';
import { MainContext } from "../App";

const Main = () => {
    const [newColumn, setNewColumn] = useState(false);
    const [input, setInput] = useState('');
    const {
        handleShowElement,
        isClicked,
        taskItemList,
        mainSection,
        popup,
        setColumns,
        columns,
        thisColumn
    } = useContext(MainContext);

    useEffect(() => {
        !newColumn && setInput('');
    }, [newColumn]);

    const handleNewColumn = () => {
        setColumns([...columns, input + 'Column']);
        setInput('');
    }

    useEffect(() => {
        localStorage.setItem('columns', JSON.stringify(columns));
        setNewColumn(false);
    }, [columns]);

    const handleColumnDeletion = (clmn) => {
        const newColumns = columns.filter(column => column !== clmn);
        setColumns(newColumns);
    }

    return (
        <main ref={mainSection} style={{pointerEvents: popup ? 'none' : 'unset'}}>
            <h1 title={newColumn ? 'Close' : 'Add Column'} id='addColumnBtn' onClick={() => setNewColumn(!newColumn)} style={{transform: `rotate(${newColumn ? 45 : 0}deg)`}}>+</h1>
            {newColumn && <input type="text" id="newColumnText" placeholder="Column Name" autoFocus value={input} onChange={(e) => setInput(e.target.value)} />}
            {input && <button id='newColumnSubmit' onClick={handleNewColumn}>Add {input}</button>}
            <div id="columnContainer">
                <div className="column" id='todoColumn' style={{display: !thisColumn ? 'flex' : 'none'}}>
                    <h2>Todo</h2>
                    <div className="taskContainer" ref={taskItemList}>
                        <TaskList />
                    </div>
                    <SettingsList />
                    <h1 title={isClicked ? 'Close' : 'Add Task'} onClick={handleShowElement} style={{transform: isClicked ? 'rotate(135deg) scale(1.5)' : 'rotate(0deg) scale(1)'}}>+</h1>
                </div>
                {columns.map(column => {
                    const columnText = column.slice(0, column.length - 6);
                    return (
                        <div className="column" id={column.replace(/ /g, '')} key={column} style={thisColumn ? {display: columnText === thisColumn ? 'flex' : 'none'} : {display: 'flex'}}>
                            <h6 className='deleteColumnBtn' onClick={() => handleColumnDeletion(column)}>Delete {columnText}</h6>
                            <h2>{columnText}</h2>
                            <div className="taskContainer"></div>
                        </div>
                    );
                })}
            </div>
        </main>
    )
}

export default Main;