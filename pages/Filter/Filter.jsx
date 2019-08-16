import { API } from 'aws-amplify'
import PropTypes from 'prop-types'
import React, { useState, useContext } from 'react'
import {
  LoadingHeader,
  RootPaper,
  SchemaForm,
  SearchResultsList,
  LoadingScreen,
} from '../../components'
import { HelpersContext, SchemaContext } from '../../contexts'

const Filter = ({ history}) => {
  const { showAlert, filterResults, setFilterResults } = useContext(HelpersContext)
  const schema = useContext(SchemaContext)
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
        {schema ? (
          <SchemaForm
            schema={schema.components.schemas.InstrumentFilter}
            onSubmit={handleSubmit}
            error={error}
          />
        ) : (
          <LoadingScreen />
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
  history: PropTypes.object.isRequired,
}

export default Filter
