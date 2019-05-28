import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RootPaper, LoadingHeader } from '../../components'
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button
} from '@material-ui/core'
import { Fields } from '../../components'
import { lastButton } from '../../globalStyles'
import { withStyles } from '@material-ui/styles';

const styles = {
  lastButton
}

class Filter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      type: '',
      size: '',
      location: '',
      notAssigned: false
    }
  }

  onSubmit = () => {}

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handleCheck = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  validateForm = () => {
    return (this.state.type || this.state.size || this.state.location)
  }

  render() {
    const { classes } = this.props
    const { type, size, location, notAssigned } = this.state
    return (
      <RootPaper>
        <LoadingHeader isLoading={this.state.isLoading} title="Filter Instruments" />
        <form onSubmit={this.onSubmit}>
          <Fields.InstrumentTypeSelect
            error={false}
            value={type}
            onChange={this.handleChange('type')}
          />
          <Fields.InstrumentSizeSelect
            error={false}
            value={size}
            onChange={this.handleChange('size')}
            instrumentType={type}
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
      </RootPaper>
    )
  }
}

Filter.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Filter)
