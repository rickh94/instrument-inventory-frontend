import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { withRouter } from 'react-router-dom'

import { lastButton } from '../../globalStyles'
import { API } from 'aws-amplify'
import { LoadingHeader, Scanner } from '..'
import {
  FormControl,
  InputLabel,
  Button,
  Input,
  InputAdornment,
  IconButton,
  FormHelperText,
  FormGroup,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'

const getSearchParameters = input =>
  input.match(/\w?\d+-\d+/)
    ? ['search/number', 'instrumentNumber']
    : ['search/assigned', 'assignedTo']

const useStyles = makeStyles({ lastButton })

const FindInstrument = ({ showMultipleResults, showAlert, history }) => {
  const [isLoading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const classes = useStyles()

  const onDetected = result => {
    if (result.codeResult.code !== searchTerm) {
      setSearchTerm(result.codeResult.code)
      setScanning(false)
    }
  }

  const onSubmit = async event => {
    event.preventDefault()

    if (!searchTerm) {
      setError('Please enter a search term')
    }

    setLoading(true)
    const [path, fieldName] = getSearchParameters(searchTerm)

    try {
      const response = await API.post('instrument-inventory', path, {
        body: { [fieldName]: searchTerm },
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
        setError(err.response.data)
      } else {
        console.error(err)
      }
    }
  }

  return (
    <React.Fragment>
      <LoadingHeader isLoading={isLoading} title="Find an Instrument" />
      <form onSubmit={onSubmit}>
        <FormControl fullWidth error={error ? true : false}>
          <InputLabel htmlFor="search-term">Number or Name</InputLabel>
          {scanning ? (
            <React.Fragment>
              <Scanner onDetected={onDetected} />
              <Button onClick={() => this.setState({ scanning: false })}>
                Stop Scanning
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Input
                id="search-term"
                onChange={event => setSearchTerm(event.target.value)}
                aria-describedby="instrument-number-error"
                type="text"
                value={searchTerm}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setScanning(true)}>
                      <FontAwesomeIcon icon={faBarcode} />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {error && (
                <FormHelperText id="instrument-number-error">{error}</FormHelperText>
              )}
            </React.Fragment>
          )}
        </FormControl>
        <FormGroup row>
          <Button onClick={() => setSearchTerm('')} className={classes.lastButton}>
            Clear
          </Button>
          <Button type="submit" color="primary" disabled={searchTerm === ''}>
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
}

export default withRouter(FindInstrument)
