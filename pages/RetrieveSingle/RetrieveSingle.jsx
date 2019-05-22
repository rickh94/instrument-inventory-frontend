import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import {
  Paper,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  InputLabel,
  Input,
  FormGroup,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  InputAdornment
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'
import { API } from 'aws-amplify'

import Scanner from '../../components/Scanner'
import LoadingHeader from '../../components/LoadingHeader'
import { root, lastButton, fullWidth } from '../../globalStyles'

const styles = {
  root,
  lastButton,
  buttons: fullWidth
}

class RetrieveSingle extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instrumentNumber: '',
      error: '',
      ask: false,
      scanning: false,
      isLoading: false
    }
  }

  retrieveAnother = () => {
    this.setState({ instrumentNumber: '', ask: false })
  }

  handleSubmit = async e => {
    e.preventDefault()

    if (!this.state.instrumentNumber) {
      this.setState({ error: 'Please Provide an instrument number' })
      return
    }

    this.setState({ isLoading: true })

    try {
      await API.post('instrument-inventory', 'retrieve-single', {
        body: { instrumentNumber: this.state.instrumentNumber.toUpperCase() }
      })
      this.setState({ ask: true })
    } catch (err) {
      this.setState({ error: err.response.data })
      console.error(err)
    }
    this.setState({ isLoading: false })
  }

  onDetected = result => {
    if (result.codeResult.code !== this.state.instrumentNumber) {
      this.setState({ instrumentNumber: result.codeResult.code, scanning: false })
    }
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <LoadingHeader
            isLoading={this.state.isLoading}
            title="Retrieve an Instrument"
          />
          <form onSubmit={this.handleSubmit}>
            <FormControl fullWidth error={this.state.error ? true : false}>
              <InputLabel htmlFor="instrument-number">Instrument Number</InputLabel>
              <Input
                id="instrument-number"
                required
                onChange={e => this.setState({ instrumentNumber: e.target.value })}
                aria-describedby="instrument-number-error"
                type="text"
                value={this.state.instrumentNumber}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => this.setState({ scanning: !this.state.scanning })}
                    >
                      <FontAwesomeIcon icon={faBarcode} />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {this.state.error && (
                <FormHelperText id="instrument-number-error">
                  {this.state.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormGroup row className={classes.buttons}>
              <Button
                onClick={() => this.setState({ instrumentNumber: '', scanning: false })}
                className={classes.lastButton}
              >
                Clear
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </FormGroup>
          </form>
          {this.state.scanning && <Scanner onDetected={this.onDetected} />}
        </Paper>
        <Dialog open={this.state.ask} onClose={this.retrieveAnother}>
          <DialogContent>
            <DialogContentText>
              Instrument {this.state.instrumentNumber} marked retrieved.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.history.push('/')}>Return Home</Button>
            <Button onClick={this.retrieveAnother}>Continue</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

RetrieveSingle.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RetrieveSingle)
