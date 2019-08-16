import React, { useState, useContext } from 'react'
// noinspection NpmUsedModulesInstalled
import PropTypes from 'prop-types'

import { API } from 'aws-amplify'
import { LoadingHeader, RootPaper, SchemaForm } from '../../components'
import { HelpersContext } from '../../contexts';

const SignOut = ({ match, history, schema }) => {
  const { showAlert } = useContext(HelpersContext)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { number } = match.params

  const handleSubmit = async body => {
    try {
      setLoading(true)
      const response = await API.post('instrument-inventory', 'sign-out', { body })
      setLoading(false)
      showAlert(response.message)
      history.push(`/instrument/${response.id}`)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <RootPaper>
      <LoadingHeader isLoading={isLoading} title="Sign Out an Instrument" />
      {schema && (
        <SchemaForm
          schema={schema.components.schemas.SignOut}
          onSubmit={handleSubmit}
          error={error}
          initialData={{ number }}
        />
      )}
    </RootPaper>
  )
}

SignOut.propTypes = {
  schema: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default SignOut
