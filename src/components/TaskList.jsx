import { useState, useEffect, useContext } from "react";
import { MainContext } from "../App";

const TaskList = () => {
  // Animation to the tasks
  const [shift, setShift] = useState(true);

  const { tasks, handleDelete, handleMouseDown } = useContext(MainContext);

  useEffect(() => {
    const myTimeout = setTimeout(() => {
      setShift(false);
    }, 100);

    return () => clearTimeout(myTimeout);
  }, [shift]);

  return (
      tasks.map(task => 
        <div key={task.id} id={task.id} className='task' onMouseDown={handleMouseDown} style={{transform: `translateX(${shift ? -100 : 0}%)`}}>
          <h6>{task.date}</h6>
            <p>{task.title}</p>
            <b className='trashBtn' onClick={() => handleDelete(task.id)}>X</b>
        </div>
      )
  )
}

export default TaskList