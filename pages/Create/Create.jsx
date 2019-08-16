import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

import { API } from 'aws-amplify'
import { LoadingHeader, RootPaper, SchemaForm } from '../../components'
import temporaryError from '../../libs/temporaryError'
import { HelpersContext, SchemaContext } from '../../contexts'

const Create = ({ history }) => {
  const { showAlert } = useContext(HelpersContext)
  const schema = useContext(SchemaContext)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async body => {
    try {
      setLoading(true)
      const response = await API.post('instrument-inventory', 'instruments', { body })
      setLoading(false)
      history.push(`/instrument/${response.id}`)
      showAlert(`${response.item.type} ${response.item.number} created`)
    } catch (err) {
      temporaryError({ setError, message: err })
      setLoading(false)
    }
  }

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
  history: PropTypes.object.isRequired,
}

export default Create
