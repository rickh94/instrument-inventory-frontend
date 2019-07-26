import { API } from 'aws-amplify'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  LoadingHeader,
  RootPaper,
  SchemaForm,
  SearchResultsList,
} from '../../components'

const Filter = ({ history, schema, showAlert, filterResults, setFilterResults }) => {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const handleSubmit = async body => {
    try {
      setLoading(true)
      const response = await API.post('instrument-inventory', 'filter', { body })
      if (response.length == 0) {
        showAlert('No Matching Instruments Found')
        setLoading(false)
      } else if (response.length == 1) {
        showAlert('One match found')
        history.push(`/instrument/${response[0].id}`)
      } else {
        setFilterResults(response)
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
      if (err.response.data) {
        setError(new Error(err.response.data))
      } else {
        showAlert(err)
      }
    }
  }

  return (
    <React.Fragment>
      <RootPaper>
        <LoadingHeader isLoading={isLoading} title="Filter Instruments" />
        {schema && (
          <SchemaForm
            schema={schema.components.schemas.InstrumentFilter}
            onSubmit={handleSubmit}
            error={error}
          />
        )}
      </RootPaper>
      {filterResults.length > 0 && (
        <RootPaper>
          <SearchResultsList results={filterResults} />
        </RootPaper>
      )}
    </React.Fragment>
  )
}

Filter.propTypes = {
  schema: PropTypes.object,
  history: PropTypes.object.isRequired,
  showAlert: PropTypes.func.isRequired,
  filterResults: PropTypes.array,
  setFilterResults: PropTypes.func.isRequired,
}

export default Filter
