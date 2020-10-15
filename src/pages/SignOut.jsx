import React, { useState, useContext, makeStyles } from 'react'
import PropTypes from 'prop-types'

import { API } from 'aws-amplify'
import { LoadingHeader, RootPaper, SchemaForm } from '../components'
import { HelpersContext } from '../contexts'
import { Button, Typography } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import Papa from 'papaparse'
import FormControl from '@material-ui/core/FormControl'


const SignOut = ({ match, history, schema }) => {
  const { showAlert } = useContext(HelpersContext)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [multipleData, setMultipleData] = useState()
  const [multipleErrors, setMultipleErrors] = useState('No CSV File')
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
      setLoading(false)
    }
  }

  const handleSubmitMultiple = async () => {
    try {
      const multipleBody = {
        instruments: multipleData,
      }
      console.log(multipleBody)
      setLoading(true)
      const response = await API.post('instrument-inventory', 'sign-out/multiple', { body: multipleBody })
      setLoading(false)
      showAlert(`Signed out ${response.updated}`)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  const handleMultipleCsv = async (event) => {
    Papa.parse(event.target.files[0], {
      complete: (results, _file) => {
        if (results.data[0].number === undefined || results.data[0].assignedTo === undefined || results.data[0].location === undefined) {
          setMultipleErrors('Invalid Data')
          return
        }
        setMultipleData(results.data.filter(item => item.number.length > 3 && item.assignedTo.length > 0 && item.location.length > 0))
        setMultipleErrors(null)
      },
      header: true,
    })
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
      <Divider variant="middle" />
      <form onSubmit={handleSubmitMultiple} style={{ margin: '1rem auto' }}>
        <Typography variant="h6">Sign Out Multiple</Typography>
        <input type="file" id="upload-csv" accept="text/csv" style={{ display: 'none' }} onChange={handleMultipleCsv} />
        <FormControl fullWidth>
          <label htmlFor="upload-csv">
            <Button variant="contained" component="span" color="primary">Upload csv</Button>
          </label>
        </FormControl>
        {multipleErrors &&
        <Typography variant="body1">{multipleErrors}</Typography>
        }
        <Button disabled={multipleErrors}
                variant="contained"
                color="primary"
                style={{ margin: '1rem auto' }}
                onClick={handleSubmitMultiple}>Submit Multiple</Button>
      </form>
    </RootPaper>
  )
}

SignOut.propTypes = {
  schema: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default SignOut
