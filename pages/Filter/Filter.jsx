import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RootPaper, LoadingHeader, SearchResultsList } from '../../components'
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
} from '@material-ui/core'
import { Fields } from '../../components'
import { lastButton } from '../../globalStyles'
import { withStyles } from '@material-ui/styles'
import { API } from 'aws-amplify'

const styles = {
  lastButton,
}

class Filter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      instrumentType: '',
      size: '',
      location: '',
      notAssigned: false,
      results: [],
    }
  }

  componentDidMount() {
    if (this.props.filterResults.length > 0) {
      this.setState({ results: this.props.filterResults })
    }
  }

  onSubmit = async event => {
    event.preventDefault()

    if (!this.validateForm) {
      this.props.showAlert('Please select something.')
      return
    }

    this.setState({ isLoading: true })
    const { instrumentType, size, location, notAssigned } = this.state

    try {
      const response = await API.post('instrument-inventory', 'filter', {
        body: {
          instrumentType,
          size,
          location,
          notAssigned,
        },
      })
      if (response.length == 0) {
        this.props.showAlert('No matching Instruments Found')
      } else if (response.length == 1) {
        this.props.showAlert('One match found.')
        this.props.history.push(`/instrument/${response[0].id}`)
      } else {
        this.setState({ results: response })
        this.props.setFilterResults(response)
      }
    } catch (err) {
      console.error(err)
      if (err.response.data) {
        this.props.showAlert(err.response.data)
      }
    }

    this.setState({ isLoading: false })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handleCheck = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  validateForm = () => {
    return this.state.instrumentType || this.state.size || this.state.location
  }

  clearForm = () => {
    this.setState({ type: '', size: '', location: '', notAssigned: false, results: [] })
    this.props.setFilterResults([])
  }

  render() {
    const { classes } = this.props
    const { instrumentType, size, location, notAssigned, results } = this.state
    return (
      <RootPaper>
        <LoadingHeader isLoading={this.state.isLoading} title="Filter Instruments" />
        <form onSubmit={this.onSubmit}>
          <Fields.InstrumentTypeSelect
            error={false}
            value={instrumentType}
            onChange={this.handleChange('instrumentType')}
          />
          <Fields.InstrumentSizeSelect
            error={false}
            value={size}
            onChange={this.handleChange('size')}
            instrumentType={instrumentType}
          />
          <Fields.LocationSelect
            error={false}
            value={location}
            onChange={this.handleChange('location')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={notAssigned}
                onChange={this.handleCheck('notAssigned')}
              />
            }
            label="Show only unassigned instruments"
          />
          <FormGroup row>
            <Button onClick={this.clearForm} className={classes.lastButton}>
              Clear
            </Button>
            <Button type="submit" color="primary" disabled={!this.validateForm()}>
              Submit
            </Button>
          </FormGroup>
        </form>
        {this.state.results.length > 0 && <SearchResultsList results={results} />}
      </RootPaper>
    )
  }
}

Filter.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  showAlert: PropTypes.func.isRequired,
  filterResults: PropTypes.array.isRequired,
  setFilterResults: PropTypes.func.isRequired,
}

export default withStyles(styles)(Filter)
