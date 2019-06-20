import React from 'react'
import PropTypes from 'prop-types'

import { RootPaper, SearchResultsList, FindInstrument } from '../../components'

const Search = ({ searchResults, showAlert, setSearchResults }) => {
  const showMultipleResults = newResults => {
    setSearchResults(newResults)
  }

  return (
    <RootPaper>
      <FindInstrument showMultipleResults={showMultipleResults} showAlert={showAlert} />
      {searchResults.length > 0 && <SearchResultsList results={searchResults} />}
    </RootPaper>
  )
}

Search.propTypes = {
  setSearchResults: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  showAlert: PropTypes.func.isRequired,
}

export default Search
