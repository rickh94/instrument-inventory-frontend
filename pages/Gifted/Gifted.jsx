import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { API } from 'aws-amplify'
import { RootPaper, SearchResultsList, LoadingHeader } from '../../components'

const Gifted = ({ showAlert }) => {
  const [isLoading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  useEffect(() => {
    const getRecords = async () => {
      setLoading(true)
      try {
        const res = await API.get('instrument-inventory', 'filter/gifted')
        setRecords(res)
      } catch (err) {
        showAlert(err)
      }
      setLoading(false)
    }

    getRecords()
  }, [])
  return (
    <RootPaper>
      <LoadingHeader title="Gifted Instruments" isLoading={isLoading} />
      <SearchResultsList results={records} />
    </RootPaper>
  )
}

Gifted.propTypes = {
  showAlert: PropTypes.func.isRequired,
}

export default Gifted
