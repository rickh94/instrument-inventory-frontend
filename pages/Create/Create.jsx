import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Paper,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  FormHelperText,
  Button,
  NativeSelect,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'
import { API, Storage } from 'aws-amplify'

import { lastButton } from '../../globalStyles'
import { LoadingHeader, Scanner, RootPaper, Fields } from '../../components'
import { s3Upload } from '../../libs/awsLib'

const emptyForm = {
  instrumentNumber: '',
  instrumentType: '',
  size: '',
  location: '',
  assignedTo: '',
  maintenanceNotes: '',
  conditionNotes: '',
  condition: null,
  quality: null,
  rosin: false,
  bow: false,
  shoulderRestRockStop: false,
  readyToGo: false,
  gifted: false,
  photo: null
}

const styles = {
  lastButton,
  fileInput: {
    display: 'none'
  }
}

class Create extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...emptyForm,
      scanning: false,
      isLoading: false,
      errors: {},
      response: { message: '', item: {} }
    }
  }

  handleSubmit = async e => {
    e.preventDefault()

    if (!this.validateForm()) {
      return
    }

    this.setState({ isLoading: true })

    const {
      instrumentNumber,
      instrumentType,
      size,
      location,
      assignedTo,
      maintenanceNotes,
      conditionNotes,
      condition,
      quality,
      rosin,
      bow,
      shoulderRestRockStop,
      readyToGo,
      gifted,
      photo
    } = this.state

    try {
      let photoUrl = null
      if (photo) {
        if (photo.size > 5000000) {
          this.setState({
            errors: { photo: 'Photo is too large. Choose Photo under 5MB' }
          })
          return
        }
        const uploadedPhoto = await s3Upload(this.state.photo)
        photoUrl = await Storage.vault.get(uploadedPhoto)
      }

      const response = await API.post('instrument-inventory', 'create', {
        body: {
          instrumentNumber,
          instrumentType,
          size,
          location,
          assignedTo,
          maintenanceNotes,
          conditionNotes,
          condition,
          quality,
          rosin,
          bow,
          shoulderRestRockStop,
          readyToGo,
          gifted,
          photo: photoUrl
        }
      })
      // console.log(response)
      this.setState({ ...emptyForm, response })
    } catch (err) {
      console.error(err)
      if (err.response.data.errors) {
        this.setState({ errors: err.response.data.errors })
      }
      console.error(err.response)
    }

    this.setState({ isLoading: false })
  }

  clearForm = () => {
    this.setState({
      ...emptyForm,
      scanning: false,
      response: { message: '' },
      recId: ''
    })
  }

  onDetected = result => {
    if (result.codeResult.code !== this.state.instrumentNumber) {
      this.setState({
        instrumentNumber: result.codeResult.code,
        scanning: false
      })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handlePhoto = event => {
    this.setState({ photo: event.target.files[0] })
  }

  handleCheck = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  handleRating = name => e => {
    if (e.target.value > 5 || e.target.value < 0) {
      this.setState({
        errors: { [name]: 'Value must be between 1 and 5' }
      })
    } else if (e.target.value == 0) {
      this.setState({
        [name]: null,
        errors: { ...this.state.errors, [name]: null }
      })
    } else {
      this.setState({
        [name]: e.target.value,
        errors: { ...this.state.errors, [name]: null }
      })
    }
  }

  viewCreated = () => {
    this.props.history.push(`/instrument/${this.state.response.id}`)
  }

  validateForm = () => {
    if (!this.state.instrumentNumber) {
      return false
    }
    if (!this.state.instrumentType) {
      return false
    }
    if (!this.state.size) {
      return false
    }
    if (!this.state.location) {
      return false
    }
    if (this.state.errors.condition) {
      return false
    }
    if (this.state.errors.quality) {
      return false
    }
    return true
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <RootPaper>
          <LoadingHeader
            isLoading={this.state.isLoading}
            title="Create a New Instrument"
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
                    onChange={this.handleChange('instrumentNumber')}
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
                  {this.state.errors.instrumentNumber && (
                    <FormHelperText id="instrument-number-error">
                      {this.state.errors.instrumentNumber}
                    </FormHelperText>
                  )}
                </React.Fragment>
              )}
            </FormControl>
            <Fields.InstrumentTypeSelect
              error={this.state.errors.instrumentType}
              onChange={this.handleChange('instrumentType')}
              value={this.state.instrumentType}
              required
            />
            <Fields.InstrumentSizeSelect
              error={this.state.errors.size}
              onChange={this.handleChange('size')}
              value={this.state.size}
              instrumentType={this.state.instrumentType}
              required
            />
            <Fields.LocationSelect
              error={this.state.errors.location}
              onChange={this.handleChange('location')}
              value={this.state.location}
              required
            />
            <FormControl fullWidth error={this.state.errors.studentName ? true : false}>
              <InputLabel htmlFor="student-name">Student Name</InputLabel>
              <Input
                id="student-name"
                onChange={this.handleChange('studentName')}
                aria-describedby="student-name-error"
                type="text"
                value={this.state.studentName}
              />
              {this.state.errors.studentName && (
                <FormHelperText id="student-name-error">
                  {this.state.errors.studentName}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={this.state.errors.maintenanceNotes ? true : false}
            >
              <InputLabel htmlFor="maintenance-notes">Maintenance Notes</InputLabel>
              <Input
                id="maintenance-notes"
                onChange={this.handleChange('maintenanceNotes')}
                aria-describedby="maintenance-notes-error"
                type="text"
                value={this.state.maintenanceNotes}
                multiline
              />
              {this.state.errors.maintenanceNotes && (
                <FormHelperText id="maintenance-notes-error">
                  {this.state.errors.maintenanceNotes}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={this.state.errors.conditionNotes ? true : false}
            >
              <InputLabel htmlFor="condition-notes">Condition Notes</InputLabel>
              <Input
                id="condition-notes"
                onChange={this.handleChange('conditionNotes')}
                aria-describedby="condition-notes-error"
                type="text"
                value={this.state.conditionNotes}
                multiline
              />
              {this.state.errors.conditionNotes && (
                <FormHelperText id="condition-notes-error">
                  {this.state.errors.conditionNotes}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={this.state.errors.condition ? true : false}>
              <InputLabel htmlFor="condition">Condition Rating</InputLabel>
              <Input
                type="number"
                id="condition"
                onChange={this.handleRating('condition')}
                aria-describedby="condition-error"
              />
              {this.state.errors.condition && (
                <FormHelperText id="condition-error">
                  {this.state.errors.condition}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={this.state.errors.quality ? true : false}>
              <InputLabel htmlFor="quality">Quality Rating</InputLabel>
              <Input
                type="number"
                id="quality"
                onChange={this.handleRating('quality')}
                aria-describedby="quality-error"
              />
              {this.state.errors.quality && (
                <FormHelperText id="quality-error">
                  {this.state.errors.quality}
                </FormHelperText>
              )}
            </FormControl>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.rosin}
                    onChange={this.handleCheck('rosin')}
                  />
                }
                label="Rosin"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.bow}
                    onChange={this.handleCheck('bow')}
                  />
                }
                label="Bow"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.shoulderRestRockStop}
                    onChange={this.handleCheck('shoulderRestRockStop')}
                  />
                }
                label="Shoulder Rest/Rock Stop"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.readyToGo}
                    onChange={this.handleCheck('readyToGo')}
                  />
                }
                label="Ready To Go"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.gifted}
                    onChange={this.handleCheck('gifted')}
                  />
                }
                label="Gifted To Student"
              />
            </FormGroup>
            <input
              accept="image/*"
              id="upload-photo"
              type="file"
              className={classes.fileInput}
              onChange={this.handlePhoto}
            />
            <FormControl fullWidth error={this.state.errors.photo ? true : false}>
              <label htmlFor="upload-photo">
                <Button variant="contained" component="span" color="primary">
                  Upload Photo
                </Button>
              </label>
              {this.state.errors.photo && (
                <FormHelperText id="photo-error">
                  {this.state.errors.photo}
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
        </RootPaper>
        <Dialog
          open={this.state.response.message ? true : false}
          onClose={this.clearForm}
        >
          <DialogContent>
            <DialogContentText>{this.state.response.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.clearForm}>Create Another</Button>
            <Button onClick={this.viewCreated}>View</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

Create.propTypes = {}

export default withStyles(styles)(Create)
