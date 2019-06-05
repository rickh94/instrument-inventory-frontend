import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  FormControl,
  Input,
  InputAdornment,
  FormHelperText,
  IconButton,
  InputLabel,
  Button,
  NativeSelect,
  FormGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'

import { LoadingHeader, RootPaper, Scanner, Fields } from '../../components'
import { centerStuff, lastButton, fullWidth } from '../../globalStyles'
import { API } from 'aws-amplify'

const styles = {
  centerButtons: centerStuff,
  lastButton,
  buttons: fullWidth,
}

class SignOut extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instrumentNumber: '',
      location: '',
      assignedTo: '',
      isLoading: false,
      response: { message: '', id: '' },
      errors: {},
    }
  }

  componentDidMount() {
    const { number } = this.props.match.params
    if (number) {
      this.setState({ instrumentNumber: number })
    }
  }

  handleSubmit = async e => {
    e.preventDefault()

    if (!this.validateForm) {
      return
    }

    this.setState({ isLoading: true })

    const { instrumentNumber, location, assignedTo } = this.state

    try {
      const response = await API.post('instrument-inventory', 'sign-out', {
        body: {
          instrumentNumber,
          location,
          assignedTo,
        },
      })
      this.setState({ response })
    } catch (err) {
      if (err.response.data.errors.instrumentNumber) {
        this.setState({
          errors: { instrumentNumber: err.response.data.errors.instrumentNumber },
        })
      }
      console.error(err.response)
    }
    this.setState({ isLoading: false })
  }

  validateForm = () => {
    return this.state.instrumentNumber && this.state.location && this.state.assignedTo
  }

  onDetected = result => {
    if (result.codeResult.code !== this.state.instrumentNumber) {
      this.setState({ instrumentNumber: result.codeResult.code, scanning: false })
    }
  }

  clearForm = () => {
    this.setState({
      instrumentNumber: '',
      location: '',
      assignedTo: '',
      response: '',
    })
  }

  render() {
    const { classes } = this.props
    const {
      message,
      isLoading,
      errors,
      instrumentNumber,
      assignedTo,
      location,
      response,
    } = this.state
    return (
      <React.Fragment>
        <RootPaper>
          <LoadingHeader isLoading={isLoading} title="Sign Out an Instrument" />
          <form onSubmit={this.handleSubmit}>
            <Fields.Scanner
              label="Instrument Number"
              error={errors.instrumentNumber}
              value={instrumentNumber}
              setValue={value => this.setState({ instrumentNumber: value })}
            />
            <FormControl fullWidth error={errors.studentName ? true : false}>
              <InputLabel htmlFor="student-name">Assigned To</InputLabel>
              <Input
                id="student-name"
                onChange={e => this.setState({ assignedTo: e.target.value })}
                aria-describedby="student-name-error"
                type="text"
                value={assignedTo}
                required
              />
              {errors.assignedTo && (
                <FormHelperText id="student-name-error">
                  {errors.assignedTo}
                </FormHelperText>
              )}
            </FormControl>
            <Fields.LocationSelect
              value={location}
              onChange={e => this.setState({ location: e.target.value })}
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
        <Dialog open={response.message ? true : false} onClose={this.clearForm}>
          <DialogContent>
            <DialogContentText>{response.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.clearForm}>Continue</Button>
            <Button
              onClick={() => this.props.history.push(`/instrument/${response.id}`)}
            >
              View Instrument
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

SignOut.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
  history: PropTypes.object.isRequired,
}

export default withStyles(styles)(SignOut)
