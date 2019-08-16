import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { RootPaper, SearchResultsList, FindInstrument } from '../../components'
import { HelpersContext } from '../../contexts'

const Search = ({}) => {
  const { showAlert, searchResults, setSearchResults } = useContext(HelpersContext)

  return (
    <RootPaper>
      <FindInstrument showMultipleResults={setSearchResults} showAlert={showAlert} />
      {searchResults.length > 0 && <SearchResultsList results={searchResults} />}
    </RootPaper>
  )
}

Search.propTypes = {
}

export default Search
