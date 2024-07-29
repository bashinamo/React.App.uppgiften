import { useContext } from 'react';
import { MainContext } from '../App';

const SettingsList = () => {
  const {
    setTaskTitle,
    taskTitle,
    setTaskContent,
    taskContent,
    handleNewTask,
    isClicked
  } = useContext(MainContext);

  return (
    isClicked && (
        <>
        <input type="text" placeholder="Add Title" value={taskTitle} onChange={evt => setTaskTitle(evt.target.value)} />
        <textarea placeholder="Add Content" value={taskContent} onChange={evt => setTaskContent(evt.target.value)}></textarea>
        <button onClick={handleNewTask}>Add</button>
        </>
    )
  )
}

export default SettingsList