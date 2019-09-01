import React, { useState, useLayoutEffect, useContext } from 'react'
import { API } from 'aws-amplify'
import { RootPaper, SearchResultsList, LoadingHeader } from '../../components'
import { HelpersContext } from '../../contexts'

const Gifted = () => {
  const [isLoading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const { showAlert } = useContext(HelpersContext)

  useLayoutEffect(() => {
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

Gifted.propTypes = {}

export default Gifted
