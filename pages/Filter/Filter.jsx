import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import { RootPaper, LoadingHeader, SearchResultsList } from '../../components'
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
  makeStyles,
} from '@material-ui/core'
import { Fields } from '../../components'
import { lastButton } from '../../globalStyles'
import { API } from 'aws-amplify'

const useStyles = makeStyles({ lastButton })

const Filter = ({ history, showAlert, filterResults, setFilterResults }) => {
  const classes = useStyles()
  const [isLoading, setLoading] = useState(false)
  const [instrumentType, setInstrumentType] = useState('')
  const [size, setSize] = useState('')
  const [location, setLocation] = useState('')
  const [notAssigned, setNotAssigned] = useState(false)
  const [results, setResults] = useState([])

  const setFromEvent = setCallback => event => setCallback(event.target.value)

  const validateForm = () => instrumentType || size || location

  const updateResults = results => {
    setResults(results)
    setFilterResults(results)
  }

  const onSubmit = async event => {
    event.preventDefault()

    if (!validateForm()) {
      showAlert('Please select something')
      return
    }

    setLoading(true)
    try {
      const response = await API.post('instrument-inventory', 'filter', {
        body: {
          instrumentType,
          size,
          location,
          notAssigned,
        },
      })
      if (response.length == 0) {
        showAlert('No Matching Instruments Found')
      } else if (response.length == 1) {
        showAlert('One match found')
        history.push(`/instrument/${response[0].id}`)
      } else {
        updateResults(response)
      }
    } catch (err) {
      if (err.response.data) {
        showAlert(err.response.data)
      }
    }

    setLoading(false)
  }

  const clearAll = () => {
    setInstrumentType('')
    setSize('')
    setLocation('')
    setNotAssigned(false)
    updateResults([])
  }

  return (
    <RootPaper>
      <LoadingHeader isLoading={isLoading} title="Filter Instruments" />
      <form onSubmit={onSubmit}>
        <Fields.InstrumentTypeSelect
          error={false}
          value={instrumentType}
          onChange={setFromEvent(setInstrumentType)}
        />
        <Fields.InstrumentSizeSelect
          error={false}
          value={size}
          onChange={setFromEvent(setSize)}
          instrumentType={instrumentType}
        />
        <Fields.LocationSelect
          error={false}
          value={location}
          onChange={setFromEvent(setLocation)}
        />
        <FormControlLabel
          control={
            <Checkbox checked={notAssigned} onChange={setFromEvent(setNotAssigned)} />
          }
          label="Show only unassigned instruments"
        />
        <FormGroup row>
          <Button onClick={clearAll} className={classes.lastButton}>
            Clear
          </Button>
          <Button type="submit" color="primary" disabled={!validateForm()}>
            Submit
          </Button>
        </FormGroup>
      </form>
      {results.length > 0 && <SearchResultsList results={results} />}
    </RootPaper>
  )
}

export default Filter
