import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { withRouter } from 'react-router-dom'

import { lastButton } from '../globalStyles'
import { API } from 'aws-amplify'
import { LoadingHeader, ScannerField } from '.'
import { Button, FormGroup } from '@material-ui/core'
import { HelpersContext } from '../contexts'

export const getPath = input =>
  input.match(/\w?\d+-\d+/) ? 'search/number' : 'search/assigned-history'

const useStyles = makeStyles(theme => ({
  lastButton,
  firstButton: { marginRight: theme.spacing(-1) },
}))

export const FindInstrument = ({ showMultipleResults, history }) => {
  const { showAlert } = useContext(HelpersContext)
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
    const path = getPath(term)

    try {
      const response = await API.post('instrument-inventory', path, {
        body: { term },
      })

      if (response.length == 1) {
        showAlert('Instrument found')
        showMultipleResults([])
        history.push(`/instrument/${response[0].id}`)
      } else {
        showMultipleResults(response)
      }
    } catch (err) {
      if (err.response) {
        showAlert(`Error: ${err.response.data}`)
      } else {
        showAlert(`Error: ${err}`)
      }
    }
    setLoading(false)
  }

  return (
    <>
      <LoadingHeader isLoading={isLoading} title="Find an Instrument" />
      <form onSubmit={onSubmit}>
        <ScannerField
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
            className={classes.firstButton}
          >
            Submit
          </Button>
        </FormGroup>
      </form>
    </>
  )
}

FindInstrument.propTypes = {
  showMultipleResults: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(FindInstrument)
