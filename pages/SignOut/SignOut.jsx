import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Paper,
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
  DialogContentText
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'

import LoadingHeader from '../../components/LoadingHeader'
import Scanner from '../../components/Scanner'
import { root, centerStuff, lastButton, fullWidth } from '../../globalStyles'
import { API } from 'aws-amplify'

const styles = {
  root,
  centerButtons: centerStuff,
  lastButton,
  buttons: fullWidth
}

class SignOut extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instrumentNumber: '',
      school: '',
      studentName: '',
      scanning: false,
      isLoading: false,
      response: '',
      errors: {}
    }
  }

  handleSubmit = async e => {
    e.preventDefault()

    if (!this.validateForm) {
      return
    }

    this.setState({ isLoading: true })

    const { instrumentNumber, school, studentName } = this.state

    try {
      const response = await API.post('instrument-inventory', 'sign-out', {
        body: {
          instrumentNumber,
          school,
          studentName
        }
      })
      this.setState({ response })
    } catch (err) {
      if (err.response.data.errors.instrumentNumber) {
        this.setState({
          errors: { instrumentNumber: err.response.data.errors.instrumentNumber }
        })
      }
      console.error(err.response)
    }
    this.setState({ isLoading: false })
  }

  validateForm = () => {
    return this.state.instrumentNumber && this.state.school && this.state.studentName
  }

  onDetected = result => {
    if (result.codeResult.code !== this.state.instrumentNumber) {
      this.setState({ instrumentNumber: result.codeResult.code, scanning: false })
    }
  }

  clearForm = () => {
    this.setState({
      instrumentNumber: '',
      school: '',
      studentName: '',
      scanning: false,
      response: ''
    })
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <LoadingHeader
            isLoading={this.state.isLoading}
            title="Sign Out an Instrument"
          />
          <form onSubmit={this.handleSubmit}>
            <FormControl
              fullWidth
              error={this.state.errors.instrumentNumber ? true : false}
            >
              <InputLabel htmlFor="instrument-number">Instrument Number</InputLabel>
              {this.state.scanning ? (
                <React.Fragment>
                  <Scanner onDetected={this.onDetected} />
                  <div className={classes.centerButtons}>
                    <Button onClick={() => this.setState({ scanning: false })}>
                      Stop Scanning
                    </Button>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Input
                    id="instrument-number"
                    onChange={e => this.setState({ instrumentNumber: e.target.value })}
                    aria-describedby="instrument-number-error"
                    type="text"
                    value={this.state.instrumentNumber}
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
                  {this.state.errors && (
                    <FormHelperText id="instrument-number-error">
                      {this.state.errors.instrumentNumber}
                    </FormHelperText>
                  )}
                </React.Fragment>
              )}
            </FormControl>
            <FormControl fullWidth error={this.state.errors.studentName ? true : false}>
              <InputLabel htmlFor="student-name">Student Name</InputLabel>
              <Input
                id="student-name"
                onChange={e => this.setState({ studentName: e.target.value })}
                aria-describedby="student-name-error"
                type="text"
                value={this.state.studentName}
                required
              />
              {this.state.errors.studentName && (
                <FormHelperText id="student-name-error">
                  {this.state.errors.studentName}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={this.state.errors.school ? true : false}>
              <InputLabel htmlFor="school">School</InputLabel>
              <NativeSelect
                id="instrument-number"
                onChange={e => this.setState({ school: e.target.value })}
                aria-describedby="student-name-error"
                value={this.state.school}
                required
              >
                <option value="" />
                <option value="Grant Elementary School">Grant Elementary School</option>
                <option value="Hedgepath Middle School">Hedgepath Middle School</option>
                <option value="Trenton High School">Trenton High School</option>
                <option value="Columbus Elementary School">
                  Columbus Elementary School
                </option>
              </NativeSelect>
              {this.state.errors.school && (
                <FormHelperText id="student-name-error">
                  {this.state.errors.school}
                </FormHelperText>
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
        </Paper>
        <Dialog open={this.state.response ? true : false} onClose={this.clearForm}>
          <DialogContent>
            <DialogContentText>{this.state.response}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.history.push('/')}>Return Home</Button>
            <Button onClick={this.clearForm}>Continue</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

SignOut.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SignOut)
