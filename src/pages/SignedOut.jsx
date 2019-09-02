import React, { useState, useEffect, useContext } from 'react'
import { API } from 'aws-amplify'
import { RootPaper, SearchResultsList, LoadingHeader } from '../components'
import { HelpersContext } from '../contexts'

const SignedOut = ({}) => {
  const [isLoading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const { showAlert } = useContext(HelpersContext)

  useEffect(() => {
    const getRecords = async () => {
      setLoading(true)
      try {
        const res = await API.get('instrument-inventory', 'filter/signed-out')
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
      <LoadingHeader title="Signed Out Instruments" isLoading={isLoading} />
      <SearchResultsList results={records} />
    </RootPaper>
  )
}

SignedOut.propTypes = {}

export default SignedOut
