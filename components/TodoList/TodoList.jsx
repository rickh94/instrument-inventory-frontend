import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  IconButton,
  TableBody,
  TextField,
  Button,
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline'
import CheckCircle from '@material-ui/icons/CheckCircle'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import { LoadingHeader } from '..'
import { API } from 'aws-amplify'

const TodoList = () => {
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

  const afterCreate = () => {
    afterAction()
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
            <CreateTodoForm
              after={afterCreate}
              before={beforeAction}
              cancel={() => setCreating(false)}
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
            />
          ))}
          <TableRow
            component="tr"
            hover
            onClick={() => {
              setShowCompleted(c => !c)
              setNeedsUpdate(true)
            }}
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

const TodoItem = ({ item, beforeAction, afterAction }) => {
  const deleteTodo = async () => {
    beforeAction()
    try {
      await API.del('instrument-inventory', `todos/${item.todoId}`)
    } catch (err) {
      console.error(err)
    }
    afterAction()
  }

  const toggleCompleted = async () => {
    beforeAction()
    try {
      const end = item.completed ? 'unmark-completed' : 'mark-completed'
      await API.post('instrument-inventory', `todos/${item.todoId}/${end}`)
    } catch (err) {
      console.error(err)
    }
    afterAction()
  }

  return (
    <TableRow component="tr">
      <TableCell component="td">
        <IconButton size="small" onClick={toggleCompleted}>
          {item.completed ? <CheckCircle /> : <CheckCircleOutline />}
        </IconButton>
      </TableCell>
      <TableCell component="td">{item.content}</TableCell>
      <TableCell component="td">{item.relevantInstrument}</TableCell>
      <TableCell component="td">
        <IconButton size="small" onClick={deleteTodo}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

TodoItem.propTypes = {
  item: PropTypes.object.isRequired,
  beforeAction: PropTypes.func,
  afterAction: PropTypes.func,
}

const CreateTodoForm = ({ before, after, cancel }) => {
  const [content, setContent] = useState('')
  const [relevantInstrument, setRelevantInstrument] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = async () => {
    if (!content) {
      setError(true)
      return
    }

    before()
    try {
      await API.post('instrument-inventory', 'todos', {
        body: { content, relevantInstrument },
      })
    } catch (err) {
      console.error(err)
    }

    after()
  }

  return (
    <TableRow component="tr">
      <TableCell component="td">
        <AddIcon style={{ marginLeft: '3px' }} />
      </TableCell>
      <TableCell component="td">
        <TextField
          style={{ verticalAlign: 'center' }}
          label="Task"
          value={content}
          onChange={event => setContent(event.target.value)}
          required
          error={error}
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
        <Button onClick={handleSubmit} size="small">
          Submit
        </Button>
        <Button onClick={cancel} size="small">
          Cancel
        </Button>
      </TableCell>
    </TableRow>
  )
}

CreateTodoForm.propTypes = {
  before: PropTypes.func,
  after: PropTypes.func,
}
