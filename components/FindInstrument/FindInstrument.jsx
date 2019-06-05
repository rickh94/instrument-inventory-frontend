import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { withRouter } from 'react-router-dom'

import { lastButton } from '../../globalStyles'
import { API } from 'aws-amplify'
import { LoadingHeader, Fields } from '..'
import { Button, FormGroup } from '@material-ui/core'

export const getSearchParameters = input =>
  input.match(/\w?\d+-\d+/)
    ? ['search/number', 'instrumentNumber']
    : ['search/assigned', 'assignedTo']

const useStyles = makeStyles({ lastButton })

export const FindInstrument = ({ showMultipleResults, showAlert, history }) => {
  const [isLoading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const classes = useStyles()

  const onSubmit = async event => {
    if (event) {
      event.preventDefault()
    }

    if (!searchTerm) {
      setError('Please enter a search term')
      return
    }

    await getInstrument(searchTerm)
  }

  const getInstrument = async term => {
    setLoading(true)
    const [path, fieldName] = getSearchParameters(term)

    try {
      const response = await API.post('instrument-inventory', path, {
        body: { [fieldName]: term },
      })

      if (response.length == 1) {
        showAlert('Instrument found')
        showMultipleResults([])
        history.push(`/instrument/${response[0].id}`)
      } else {
        setLoading(false)
        showMultipleResults(response)
      }
    } catch (err) {
      setLoading(false)
      if (err.response) {
        showAlert(`Error: ${err}`)
        // setError(err.response.data)
      } else {
        showAlert(`Error: ${err}`)
      }
    }
    setLoading(false)
  }

  return (
    <React.Fragment>
      <LoadingHeader isLoading={isLoading} title="Find an Instrument" />
      <form onSubmit={onSubmit}>
        <Fields.Scanner
          value={searchTerm}
          setValue={setSearchTerm}
          error={error}
          label="Name or Number"
          submitCallback={getInstrument}
        />
        <FormGroup row>
          <Button
            onClick={() => setSearchTerm('')}
            className={classes.lastButton}
            data-testid="clear-button"
          >
            Clear
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={searchTerm === ''}
            data-testid="submit-button"
          >
            Submit
          </Button>
        </FormGroup>
      </form>
    </React.Fragment>
  )
}

FindInstrument.propTypes = {
  showMultipleResults: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(FindInstrument)
