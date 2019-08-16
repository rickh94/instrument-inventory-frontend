import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  Button,
} from '@material-ui/core'
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline'
import CheckCircle from '@material-ui/icons/CheckCircle'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import EditIcon from '@material-ui/icons/Edit'

import { LoadingHeader } from '..'
import { API } from 'aws-amplify'
import TooltipIconButton from '../TooltipIconButton/TooltipIconButton'
import { HelpersContext } from '../../contexts'

const TodoList = ({}) => {
  const { showAlert } = useContext(HelpersContext)
  const [todoList, setTodoList] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [needsUpdate, setNeedsUpdate] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const getTodos = async () => {
      try {
        const endpoint = showCompleted ? 'todos/completed' : 'todos/active'
        const response = await API.get('instrument-inventory', endpoint)
        setTodoList(response)
      } catch (e) {
        console.error(e)
      }
    }
    if (needsUpdate) {
      getTodos()
      setNeedsUpdate(false)
    }
  }, [needsUpdate])

  const beforeAction = () => {
    setLoading(true)
  }

  const afterAction = () => {
    setNeedsUpdate(true)
    setLoading(false)
  }

  const createTodo = async data => {
    if (!data.content) {
      showAlert('Please enter some content')
      return
    }

    setLoading(true)
    try {
      await API.post('instrument-inventory', 'todos', {
        body: data,
      })
      showAlert('Todo Created')
    } catch (err) {
      showAlert(`Error: ${err}`)
    }

    setLoading(false)
    setNeedsUpdate(true)
    setCreating(false)
  }

  return (
    <React.Fragment>
      <LoadingHeader isLoading={isLoading} title="Todo List" />
      <br />
      <Table component="table" size="small">
        <TableHead component="thead">
          <TableRow component="tr">
            <TableCell component="th">Status</TableCell>
            <TableCell component="th">Task</TableCell>
            <TableCell component="th">Instrument</TableCell>
            <TableCell component="th">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody component="tbody">
          {creating ? (
            <TodoForm
              onSubmit={createTodo}
              icon={<AddIcon style={{ marginLeft: '3px' }} />}
              onCancel={() => setCreating(false)}
            />
          ) : (
            <TableRow component="tr" hover onClick={() => setCreating(true)}>
              <TableCell component="td">
                <AddIcon style={{ marginLeft: '3px' }} />
              </TableCell>
              <TableCell component="td">Create Todo</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          )}
          {todoList.map(item => (
            <TodoItem
              item={item}
              key={item.todoId}
              beforeAction={beforeAction}
              afterAction={afterAction}
              showAlert={showAlert}
            />
          ))}
          <TableRow
            component="tr"
            hover
            onClick={() => {
              setShowCompleted(c => !c)
              setNeedsUpdate(true)
            }}
            data-testid="toggle-completed"
          >
            <TableCell component="td">
              <ArrowForwardIcon />
            </TableCell>
            <TableCell component="td">
              Show {showCompleted ? 'Incomplete' : 'Completed'}
            </TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </React.Fragment>
  )
}

TodoList.propTypes = {}

export default TodoList

const TodoItem = ({ item, beforeAction, afterAction, showAlert }) => {
  const [editing, setEditing] = useState(false)
  const deleteTodo = async () => {
    beforeAction()
    try {
      await API.del('instrument-inventory', `todos/${item.todoId}`)
    } catch (err) {
      showAlert(`Error: ${err}`)
    }
    afterAction()
  }

  const toggleCompleted = async () => {
    beforeAction()
    try {
      const end = item.completed ? 'unmark-completed' : 'mark-completed'
      await API.post('instrument-inventory', `todos/${item.todoId}/${end}`)
    } catch (err) {
      showAlert(`Error: ${err}`)
    }
    afterAction()
  }

  const updateTodo = async data => {
    beforeAction()

    if (!data.content) {
      showAlert('Please enter some content')
      return
    }
    try {
      await API.put('instrument-inventory', `todos/${item.todoId}`, { body: data })
    } catch (err) {
      showAlert(`Error: ${err}`)
    }

    setEditing(false)
    afterAction()
  }

  return (
    <React.Fragment>
      {editing ? (
        <TodoForm
          onSubmit={updateTodo}
          icon={<EditIcon />}
          onCancel={() => setEditing(false)}
          initial={item}
        />
      ) : (
        <TableRow component="tr">
          <TableCell component="td">
            {item.completed ? (
              <TooltipIconButton
                title="Mark Incomplete"
                size="small"
                onClick={toggleCompleted}
              >
                <CheckCircle />
              </TooltipIconButton>
            ) : (
              <TooltipIconButton
                title="Mark Completed"
                size="small"
                onClick={toggleCompleted}
              >
                <CheckCircleOutline />
              </TooltipIconButton>
            )}
          </TableCell>
          <TableCell component="td">{item.content}</TableCell>
          <TableCell component="td">{item.relevantInstrument}</TableCell>
          <TableCell component="td">
            <TooltipIconButton
              title="Edit"
              size="small"
              onClick={() => setEditing(true)}
            >
              <EditIcon />
            </TooltipIconButton>
            <TooltipIconButton title="Delete" size="small" onClick={deleteTodo}>
              <DeleteIcon />
            </TooltipIconButton>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}

TodoItem.propTypes = {
  item: PropTypes.object.isRequired,
  beforeAction: PropTypes.func,
  afterAction: PropTypes.func,
  showAlert: PropTypes.func.isRequired,
}

const TodoForm = ({
  initial = { content: '', relevantInstrument: '' },
  onCancel,
  onSubmit,
  icon,
}) => {
  const [content, setContent] = useState(initial.content)
  const [relevantInstrument, setRelevantInstrument] = useState(
    initial.relevantInstrument
  )

  return (
    <TableRow component="tr">
      <TableCell component="td">
        {icon}
        {/* <AddIcon style={{ marginLeft: '3px' }} /> */}
      </TableCell>
      <TableCell component="td">
        <TextField
          style={{ verticalAlign: 'center' }}
          label="Task"
          value={content}
          name="content"
          onChange={event => setContent(event.target.value)}
          required
          // error={error}
        />
      </TableCell>
      <TableCell component="td">
        <TextField
          label="Instrument"
          value={relevantInstrument}
          onChange={event => setRelevantInstrument(event.target.value)}
        />
      </TableCell>
      <TableCell component="td">
        <Button
          onClick={() => onSubmit({ content, relevantInstrument })}
          size="small"
          disabled={!content}
        >
          Submit
        </Button>
        <Button onClick={onCancel} size="small">
          Cancel
        </Button>
      </TableCell>
    </TableRow>
  )
}

TodoForm.propTypes = {
  initial: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  icon: PropTypes.element.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
