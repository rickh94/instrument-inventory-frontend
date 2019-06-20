import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import {
  FormControl,
  Button,
  Input,
  InputAdornment,
  IconButton,
  FormHelperText,
  InputLabel,
  FormGroup,
  List,
  ListItemText,
  ListItem,
  makeStyles,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'
import { withStyles } from '@material-ui/styles'
import { API } from 'aws-amplify'
import { withRouter } from 'react-router-dom'

import {
  RootPaper,
  LoadingHeader,
  Scanner,
  SearchResultsList,
  FindInstrument,
} from '../../components'
import { lastButton } from '../../globalStyles'

class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTerm: '',
      isLoading: false,
      scanning: false,
      errors: {},
      results: [],
    }
  }

  componentDidMount() {
    if (this.props.searchResults.length > 0) {
      this.setState({ results: this.props.searchResults })
    }
  }

  showResults = results => {
    this.setState({ results })
    this.props.setSearchResults(results)
  }

  render() {
    return (
      <RootPaper>
        <FindInstrument
          showMultipleResults={this.showResults}
          showAlert={this.props.showAlert}
        />
        {this.state.results.length > 0 && (
          <SearchResultsList results={this.state.results} />
        )}
      </RootPaper>
    )
  }
}

Search.propTypes = {
  history: PropTypes.object.isRequired,
  setSearchResults: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  showAlert: PropTypes.func.isRequired,
  setSearchResults: PropTypes.func.isRequired,
}

export default Search
