import './App.css'
import Header from './components/header';
import Main from './components/Main';
import { useState, useEffect, useRef, createContext } from "react";
import TaskPopup from './components/TaskPopup';
import { Routes, Route, useParams } from 'react-router-dom';

export const MainContext = createContext();
export const NavContext = createContext();

function App() {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const [tasks, setTasks] = useState(storedTasks);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskContent, setTaskContent] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const taskItemList = useRef(null);
  // Using useRef instead of using DOM (querySelector or getElement)
  let currentTask = useRef(null);
  // Adding permission to move tasks among columns
  const [movePerm, setMovePerm] = useState(false);
  const [chosenColumn, setChosenColumn] = useState(null);
  // Getting the displayed task's info
  const [thisTask, setThisTask] = useState({});
  const [popup, setPopup] = useState(false);
  // Edit tasks
  const [edit, setEdit] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const column = document.getElementsByClassName('column');
  const mainSection = useRef(null);
  const [columns, setColumns] = useState(JSON.parse(localStorage.getItem('columns')) || []);
  const [thisColumn, setThisColumn] = useState('');

  useEffect(() => {
    setTaskTitle(''); // Erasing the inputs after adding new task
    setTaskContent('');
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add new task
  const handleNewTask = () => {
    const newItem = {
      id: Date.now(),
      title: taskTitle,
      content: taskContent,
      date: new Date().toLocaleDateString(),
      parentColumn: 'todoColumn'
    }
    taskTitle && taskContent && setTasks([...tasks, newItem]); // If title and content are both not null
    taskItemList.current.scrollTop = taskItemList.current.scrollHeight; // Scoll to the added task in Todo
  }

  // The plus button that shows the button and the inputs to add new task in the Todo column
  const handleShowElement = () => {
    setIsClicked(!isClicked);
  }

  // Handle deletion
  const handleDelete = (id) => {
    // First 3 rows are just to make sure the task getting deleted without causing error
    let thisTask = tasks.find(task => task.id === id);
    document.getElementById(thisTask.id).style.transform = 'translateX(-100%)';
    //Make sure to move the deleted task to the main column first to avoid consol errors
    setTimeout(() => {
      thisTask.parentColumn !== 'todoColumn' &&
      document.getElementById('todoColumn').querySelector('.taskContainer').appendChild(document.getElementById(thisTask.id));
      setTasks(tasks.filter(task => task.id !== id));
    }, 200);
  }

  const handleMouseDown = ({ target }) => {
    if(target.className !== 'trashBtn'){ // Exclude the delete button from handle movement
      currentTask.current = target; // Selecting the task to move
      setMovePerm(true);
    }
  }

  // Styling all columns to distinguish them from the chosen column
  useEffect(() => {
    const handleColumnStyle = () => {
      for(let i = 0; i < column.length; i++)
      column[i].style.backgroundColor = '#ffffff55';
    }

    // Highlighting only the hovered column during movement
    const handleColumns = (column) => {
      setChosenColumn(column);
      handleColumnStyle();
      column.style.backgroundColor = '#e7d0f1';
    }

    // Handle the movement of tasks among columns
    const handleMouseMove = (evt) => {
      currentTask.current.style.position = 'absolute';
      // Making sure that the task is being moved appropirately with taking into account scrollLeft amount of the main section
      currentTask.current.style.left = evt.clientX - currentTask.current.offsetWidth/2 + mainSection.current.scrollLeft + 'px';
      currentTask.current.style.top = evt.clientY - currentTask.current.offsetHeight/2 - 90 + 'px';
      // Choosing the hovered column while moving tasks
      for(let i = 0; i < column.length; i++){
        if(evt.clientX > column[i].offsetLeft - mainSection.current.scrollLeft
          && evt.clientX < column[i].offsetLeft + column[i].offsetWidth + mainSection.current.scrollLeft){
            handleColumns(column[i]);
          }
      }
    }

    if(movePerm)
      window.addEventListener('mousemove', handleMouseMove);
    else
      window.removeEventListener('mousemove', handleMouseMove);

    // Stop the process of the tasks movement on mouse up event
    const handleMouseUp = (evt) => {
      if(movePerm && chosenColumn) {
        setMovePerm(false);
        currentTask.current.style.position = 'static';
        chosenColumn.querySelector('.taskContainer').appendChild(currentTask.current);
        // Changing the column name of the task, for storage purposes
        const newTasks = tasks.map(task => task.id == currentTask.current.id ? {...task, parentColumn: chosenColumn.id} : task);
        setTasks(newTasks);
        setChosenColumn(null);
        handleColumnStyle();
      } else { // Make sure that the clicked element is in fact a task
        if(evt.target.className == 'task'){
          setMovePerm(false);
          setChosenColumn(null);
          // Display the clicked task
          const thisTask = tasks.find(task => task.id == evt.target.id);
          handleDisplay(thisTask);
          setPopup(true);
        }
      }
    }

    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
  }, [movePerm, chosenColumn, tasks, column]);

  // Publishing each tesk to it's column
  function handleChildren() {
    tasks.forEach(task => handleAppendChildren(task.parentColumn, task.id));
  }
  handleChildren();

  function handleAppendChildren(columnName, child) {
    setTimeout(() => {
      document.querySelector('#' + columnName).querySelector('.taskContainer').appendChild(document.getElementById(child));
    }, 10)
  }

  // Display tasks on click
  function handleDisplay(task) {
    const thisTask = {
      title: task.title,
      content: task.content,
      date: task.date,
      parentColumn: task.parentColumn,
      id: task.id
    }
    setThisTask(thisTask);
  }

  // Fetch the title and the content of the selected task
  useEffect(() => {
    setEditedTitle(thisTask.title);
    setEditedContent(thisTask.content);
  }, [thisTask]);

  // Update task information
  function handleEditTasks() {
    setEdit(!edit);
    if(edit) {
      const newTasks = tasks.map(task => task.id == thisTask.id ? {...task, title: editedTitle, content: editedContent} : task);
      setTasks(newTasks);
    }
  }

  function FilteredColumns() {
    const { thisColumn } = useParams();
    useEffect(() => {
        setThisColumn(thisColumn);
    }, [thisColumn]);
}

  return (
    <div id="mainContainer">
      <NavContext.Provider value={{columns}}>
        <Header />
      </NavContext.Provider>

      <Routes>
        <Route path='/:thisColumn' element={<FilteredColumns />} />
        <Route path='/' element={<FilteredColumns />} />
      </Routes>

      <MainContext.Provider value={{
            tasks,
            taskTitle,
            setTaskTitle,
            taskContent,
            setTaskContent,
            handleNewTask,
            handleShowElement,
            isClicked,
            handleDelete,
            taskItemList,
            handleMouseDown,
            mainSection,
            popup,
            setColumns,
            columns,
            thisColumn
          }}>
            <Main />
        </MainContext.Provider>

      {popup && <TaskPopup
      task={thisTask}
      setPopup={setPopup}
      setEdit={setEdit}
      edit={edit}
      handleDelete={handleDelete}
      setEditedTitle={setEditedTitle}
      editedTitle={editedTitle}
      setEditedContent={setEditedContent}
      editedContent={editedContent}
      handleEditTasks={handleEditTasks} />}
    </div>
  )
}

export default App;