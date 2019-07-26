import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { API } from 'aws-amplify'
import { LoadingHeader, LoadingScreen, RootPaper, SchemaForm } from '../../components'
import temporaryError from '../../libs/temporaryError'

const RetrieveSingle = ({ history, schema, showAlert }) => {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async body => {
    setLoading(true)
    try {
      const response = await API.post('instrument-inventory', 'retrieve-single', {
        body,
      })
      showAlert(response.message)
      history.push(`/instrument/${response.id}`)
    } catch (err) {
      temporaryError({ setError, message: err.response.data })
      setLoading(false)
    }
  }

  return (
    <RootPaper>
      <LoadingHeader isLoading={isLoading} title="Retrieve an Instrument" />
      {schema ? (
        <SchemaForm
          schema={schema.components.schemas.RetrieveSingle}
          onSubmit={handleSubmit}
          error={error}
        />
      ) : (
        <LoadingScreen />
      )}
    </RootPaper>
  )
}

RetrieveSingle.propTypes = {
  history: PropTypes.object.isRequired,
  schema: PropTypes.object,
  showAlert: PropTypes.func.isRequired,
}

export default RetrieveSingle
