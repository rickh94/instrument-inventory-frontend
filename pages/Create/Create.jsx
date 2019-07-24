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
  DialogContentText
} from '@material-ui/core'
import { API, Storage } from 'aws-amplify'

import { lastButton } from '../../globalStyles'
import {
  LoadingHeader,
  Scanner,
  RootPaper,
  Fields,
  InstrumentForm
} from '../../components'
import { s3Upload } from '../../libs/awsLib'
import { makeStyles } from '@material-ui/styles'
import SchemaForm from '../../components/SchemaForm/SchemaForm'

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
  shoulderRestEndpinRest: false,
  readyToGo: false,
  gifted: false,
  photo: null
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
      shoulderRestEndpinRest,
      readyToGo,
      gifted,
      photo
    } = this.state

    condition = parseInt(`${condition}`)
    quality = parseInt(`${quality}`)

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

      const response = await API.post('instrument-inventory', 'instruments', {
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
          shoulderRestEndpinRest,
          readyToGo,
          gifted,
          photo: photoUrl
        }
      })
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

  handlePhoto = event => {
    this.setState({ photo: event.target.files[0] })
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
            {...this.state}
            onSubmit={this.handleSubmit}
            setValue={this.setValue}
            setErrors={this.setErrors}
            clearForm={this.clearForm}
            validateForm={this.validateForm}
            photoField
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

const Create2 = ({ schema }) => {
  return (
    <React.Fragment>
      <RootPaper>
        <LoadingHeader
          // isLoading={this.state.isLoading}
          title="Create a New Instrument"
        />
        {schema && (
          <SchemaForm
            schema={schema.components.schemas.Instrument}
            onSubmit={console.log}
          />
        )}
      </RootPaper>
      <Dialog
        // open={this.state.response.message ? true : false}
        // onClose={this.clearForm}
      >
        <DialogContent>
          {/* <DialogContentText>{this.state.response.message}</DialogContentText> */}
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={this.clearForm}>Create Another</Button> */}
          {/* <Button onClick={this.viewCreated}>View</Button> */}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

Create.propTypes = {
  history: PropTypes.object.isRequired
}

export default Create2
