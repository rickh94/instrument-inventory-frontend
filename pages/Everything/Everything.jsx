import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { LoadingHeader, InstrumentTable } from '../../components'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { API } from 'aws-amplify'
import { List as TableLoader } from 'react-content-loader'
import { HelpersContext } from '../../contexts'

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
    <React.Fragment>
      <div className={classes.root}>
        <LoadingHeader isLoading={isLoading} title="Everything" />
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
