import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { LoadingHeader, InstrumentTable } from '../../components'
import { Paper, makeStyles } from '@material-ui/core'
import { API } from 'aws-amplify'
import { List as TableLoader } from 'react-content-loader'

const useStyles = makeStyles({
  root: {
    margin: '0 10px',
    padding: '10px',
    overflowX: 'auto',
  },
})

const Everything = ({ showAlert }) => {
  const [isLoading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const columns = [
    'Photo',
    'Number',
    'Instrument Type',
    'Size',
    'Location',
    'Assigned To',
    'Condition Notes',
    'Maintenance Notes',
    'Ready To Go',
    'Condition',
    'Quality',
    'Rosin',
    'Bow',
    'Shoulder Rest/Endpin Rest',
    'Gifted to student',
    'History',
  ]
  useEffect(() => {
    const getRecords = async () => {
      setLoading(true)
      try {
        const res = await API.get('instrument-inventory', 'instruments/all')
        setRecords(res)
      } catch (err) {
        showAlert(err)
      }
      setLoading(false)
    }

    getRecords()
  }, [])

  const classes = useStyles()
  return (
    <Paper className={classes.root}>
      <LoadingHeader isLoading={isLoading} title="Everything" />
      {isLoading ? (
        <TableLoader />
      ) : (
        <InstrumentTable columns={columns} records={records} />
      )}
    </Paper>
  )
}

Everything.propTypes = {
  showAlert: PropTypes.func.isRequired,
}

export default Everything
