import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core'
import { API } from 'aws-amplify'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { LoadingHeader, RootPaper, SchemaForm } from '../../components'

const Create = ({ schema, history, showAlert }) => {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async body => {
    try {
      const response = await API.post('instrument-inventory', 'instruments', { body })
      history.push(`/instrument/${response.id}`)
      showAlert(`${response.item.type} ${response.item.number} created`)
    } catch (err) {
      setError(new Error(err))
    }
  }

  const viewCreated = () => {}

  return (
    <React.Fragment>
      <RootPaper>
        <LoadingHeader isLoading={isLoading} title="Create a New Instrument" />
        {schema && (
          <SchemaForm
            schema={schema.components.schemas.Instrument}
            onSubmit={handleSubmit}
            error={error}
          />
        )}
      </RootPaper>
    </React.Fragment>
  )
}

Create.propTypes = {
  schema: PropTypes.object,
  history: PropTypes.object.isRequired,
  showAlert: PropTypes.func.isRequired
}

export default Create
