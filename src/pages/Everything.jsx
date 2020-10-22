import React, { useState, useEffect, useContext } from 'react'
import { LoadingHeader, InstrumentTable } from '../components'
import { makeStyles } from '@material-ui/styles'
import { API } from 'aws-amplify'
import { List as TableLoader } from 'react-content-loader'
import { HelpersContext } from '../contexts'
import Grid from '@material-ui/core/Grid'
import { Button } from '@material-ui/core'
import Papa from 'papaparse'

const useStyles = makeStyles({
  root: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 0,
    overflow: 'hidden',
    height: '90vh',
    width: '100%',
  },
  tableWrapper: {
    height: '95%',
    width: '100%',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  },
})

const Everything = () => {
  const { showAlert } = useContext(HelpersContext)
  const [isLoading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  useEffect(() => {
    const getRecords = async () => {
      setLoading(true)
      try {
        const res = await API.get('instrument-inventory', 'instruments/all', {})
        console.log(res)
        setRecords(res.instruments)
        if (res.instrumentsFailed.length > 0) {
          console.error(res.instrumentsFailed)
        }
      } catch (err) {
        showAlert(err.toString())
      }
      setLoading(false)
    }

    getRecords()
  }, [])

  const handleDownloadCsv = () => {
    const csvData = Papa.unparse(records, {
      skipEmptyLines: true,
      header: true,
    })
    const csvDownload = document.createElement('a')
    csvDownload.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData))
    csvDownload.setAttribute('download', 'instruments-' + (new Date()).toLocaleString() + '.csv')

    csvDownload.click()
  }
  const classes = useStyles()
  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid container direction="row" justify="space-between">
          <LoadingHeader isLoading={isLoading} title="Everything" />
          <Button variant="contained" color="primary" style={{ marginLeft: '1rem' }} onClick={handleDownloadCsv}>Download
            CSV</Button>
        </Grid>
        {isLoading ? (
          <TableLoader />
        ) : (
          <div className={classes.tableWrapper}>
            <InstrumentTable records={records} />
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

Everything.propTypes = {}

export default Everything
