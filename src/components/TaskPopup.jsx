import propTypes from 'prop-types';

const TaskPopup = (props) => {
  const titleStyle = {
    backgroundColor: props.edit ? '#080' : 'var(--mainColor)',
    pointerEvents: props.edit ? 'unset' : 'none',
  }

  const contentStyle = {
    backgroundColor: props.edit ? '#080' : 'unset',
    pointerEvents: props.edit ? 'unset' : 'none',
  }

  return (
    <div id='taskViewer'>
      <h1 className='closePopup' onClick={() => {props.setPopup(false); props.setEdit(false)}}>X</h1>
      <p id='popupColumn'>{props.task.parentColumn.slice(0, props.task.parentColumn.length - 6)}</p>
      <input id="titleDisplay" value={props.editedTitle || ''} style={titleStyle} onChange={(evt) => props.setEditedTitle(evt.target.value)} />
      <p id="dateDisplay">{props.task.date}</p>
      <textarea id="contentDisplay" value={props.editedContent || ''} style={contentStyle} onChange={(evt) => props.setEditedContent(evt.target.value)}></textarea>
      <div>
        <button onClick={props.handleEditTasks}>{props.edit ? 'Save' : 'Edit'}</button>
        <button onClick={() => {props.handleDelete(props.task.id); props.setPopup(false)}}>Remove</button>
      </div>
    </div>
  )
}

TaskPopup.propTypes = {
  task: propTypes.object,
  setPopup: propTypes.func,
  setEdit: propTypes.func,
  edit: propTypes.bool,
  handleDelete: propTypes.func,
  editedTitle: propTypes.string,
  setEditedTitle: propTypes.func,
  handleEditTasks: propTypes.func,
  setEditedContent: propTypes.func,
  editedContent: propTypes.string
}

export default TaskPopup