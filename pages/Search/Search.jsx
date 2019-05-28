import React, { Component } from 'react'
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
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'
import { withStyles } from '@material-ui/styles'
import { API } from 'aws-amplify'
import { withRouter } from 'react-router-dom'

import { RootPaper, LoadingHeader, Scanner, SearchResultsList } from '../../components'
import { lastButton } from '../../globalStyles'

const getSearchParameters = input =>
  input.match(/\w?\d+-\d+/)
    ? ['search/number', 'instrumentNumber']
    : ['search/assigned', 'assignedTo']

const styles = {
  lastButton,
}

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

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  onDetected = result => {
    if (result.codeResult.code !== this.state.instrumentNumber) {
      this.setState({
        searchTerm: result.codeResult.code,
        scanning: false,
      })
    }
  }

  onSubmit = async event => {
    event.preventDefault()

    if (!this.validateForm) {
      this.setState({ errors: { searchTerm: 'Please enter a search term' } })
      return
    }

    this.setState({ isLoading: true })
    const { searchTerm } = this.state
    const [path, fieldName] = getSearchParameters(searchTerm)

    try {
      const response = await API.post('instrument-inventory', path, {
        body: { [fieldName]: searchTerm },
      })
      if (response.length == 1) {
        this.props.showAlert('Instrument found')
        this.props.history.push(`/instrument/${response[0].id}`)
      } else {
        this.setState({ results: response })
        this.props.setSearchResults(response)
      }
    } catch (err) {
      if (err.response) {
        this.setState({ errors: { searchTerm: err.response.data } })
      } else {
        console.error(err)
      }
    }
    this.setState({ isLoading: false })
  }

  clearForm = () => {
    this.setState({
      searchTerm: '',
      scanning: false,
      results: [],
    })
    this.props.setSearchResults([])
  }

  validateForm = () => {
    return this.state.searchTerm.length > 0
  }

  render() {
    const { classes } = this.props
    return (
      <RootPaper>
        <LoadingHeader isLoading={this.state.isLoading} title="Find an Instrument" />
        <form onSubmit={this.onSubmit}>
          <FormControl fullWidth error={this.state.errors.searchTerm ? true : false}>
            <InputLabel htmlFor="search-term">Number or Name</InputLabel>
            {this.state.scanning ? (
              <React.Fragment>
                <Scanner onDetected={this.onDetected} />
                <Button onClick={() => this.setState({ scanning: false })}>
                  Stop Scanning
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Input
                  id="search-term"
                  onChange={this.handleChange('searchTerm')}
                  aria-describedby="instrument-number-error"
                  type="text"
                  value={this.state.searchTerm}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          this.setState({ scanning: !this.state.scanning })
                        }
                      >
                        <FontAwesomeIcon icon={faBarcode} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {this.state.errors.searchTerm && (
                  <FormHelperText id="instrument-number-error">
                    {this.state.errors.searchTerm}
                  </FormHelperText>
                )}
              </React.Fragment>
            )}
          </FormControl>
          <FormGroup row>
            <Button onClick={this.clearForm} className={classes.lastButton}>
              Clear
            </Button>
            <Button type="submit" color="primary" disabled={!this.validateForm()}>
              Submit
            </Button>
          </FormGroup>
        </form>
        {this.state.results.length > 0 && (
          <SearchResultsList results={this.state.results} />
        )}
      </RootPaper>
    )
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  setSearchResults: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
}

export default withStyles(styles)(Search)