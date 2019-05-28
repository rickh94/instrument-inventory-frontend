import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import {
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
  DialogContentText,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'
import { API, Storage } from 'aws-amplify'

import { lastButton } from '../../globalStyles'
import {
  LoadingHeader,
  Scanner,
  RootPaper,
  Fields,
  InstrumentForm,
} from '../../components'
import { s3Upload } from '../../libs/awsLib'
import { makeStyles } from '@material-ui/styles'

const emptyForm = {
  instrumentNumber: '',
  instrumentType: '',
  size: '',
  location: '',
  assignedTo: '',
  maintenanceNotes: '',
  conditionNotes: '',
  condition: '',
  quality: '',
  rosin: false,
  bow: false,
  shoulderRestRockStop: false,
  readyToGo: false,
  gifted: false,
  photo: null,
}

class Create extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...emptyForm,
      scanning: false,
      isLoading: false,
      errors: {},
      response: { message: '', item: {} },
    }
  }

  handleSubmit = async e => {
    e.preventDefault()

    if (!this.validateForm()) {
      return
    }

    this.setState({ isLoading: true })

    let {
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
      photo,
    } = this.state

    condition = parseInt(`${condition}`)
    quality = parseInt(`${quality}`)

    try {
      let photoUrl = null
      if (photo) {
        if (photo.size > 5000000) {
          this.setState({
            errors: { photo: 'Photo is too large. Choose Photo under 5MB' },
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
          photo: photoUrl,
        },
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
      recId: '',
    })
  }

  onDetected = result => {
    if (result.codeResult.code !== this.state.instrumentNumber) {
      this.setState({
        instrumentNumber: result.codeResult.code,
        scanning: false,
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
        errors: { [name]: 'Value must be between 1 and 5' },
      })
    } else if (e.target.value == 0) {
      this.setState({
        [name]: null,
        errors: { ...this.state.errors, [name]: null },
      })
    } else {
      this.setState({
        [name]: e.target.value,
        errors: { ...this.state.errors, [name]: null },
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

  setValue = (name, value) => {
    this.setState({ [name]: value })
  }

  setErrors = (name, value) => {
    this.setState({ errors: { [name]: value, ...this.state.errors } })
  }

  render() {
    return (
      <React.Fragment>
        <RootPaper>
          <LoadingHeader
            isLoading={this.state.isLoading}
            title="Create a New Instrument"
          />
          <InstrumentForm
            onSubmit={this.handleSubmit}
            setValue={this.setValue}
            errors={this.state.errors}
            setErrors={this.setErrors}
            instrumentNumber={this.state.instrumentNumber}
            instrumentType={this.state.instrumentType}
            size={this.state.size}
            location={this.state.location}
            assignedTo={this.state.assignedTo}
            maintenanceNotes={this.state.maintenanceNotes}
            conditionNotes={this.state.conditionNotes}
            quality={this.state.quality}
            condition={this.state.condition}
            rosin={this.state.rosin}
            bow={this.state.bow}
            shoulderRestRockStop={this.state.shoulderRestRockStop}
            readyToGo={this.state.readyToGo}
            gifted={this.state.gifted}
            clearForm={this.clearForm}
            validateForm={this.validateForm}
          />
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

Create.propTypes = {
  history: PropTypes.object.isRequired,
}

export default Create
