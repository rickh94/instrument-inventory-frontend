import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { lastButton } from '../../globalStyles'
import {
  makeStyles,
  FormControl,
  InputLabel,
  Button,
  Input,
  InputAdornment,
  IconButton,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'
import { Scanner, Fields } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles({
  lastButton,
  fileInput: {
    display: 'none',
  },
})

const InstrumentForm = ({
  onSubmit,
  setValue,
  errors,
  setErrors,
  clearForm,
  validateForm,
  instrumentNumber,
  instrumentType,
  size,
  location,
  assignedTo,
  maintenanceNotes,
  conditionNotes,
  quality,
  condition,
  rosin,
  bow,
  shoulderRestRockStop,
  readyToGo,
  gifted,
}) => {
  const classes = useStyles()
  const [scanning, setScanning] = useState(false)

  const onDetected = result => {
    if (result.codeResult.code !== instrumentNumber) {
      setValue('instrumentNumber', result.codeResult.code)
      setScanning(false)
    }
  }

  const handleRating = name => event => {
    if (event.target.value > 5 || event.target.value < 0) {
      setErrors({ [name]: 'Value must be between 1 and 5' })
    } else if (event.target.value == 0) {
      setValue(name, 0)
      setErrors({ [name]: null })
    } else {
      setValue(name, event.target.value)
      setErrors({ [name]: null })
    }
  }

  const handleChange = name => event => {
    setValue(name, event.target.value)
  }

  const handleCheck = name => event => {
    setValue(name, event.target.checked)
  }

  const handlePhoto = event => {
    setValue('photo', event.target.files[0])
  }

  return (
    <form onSubmit={onSubmit}>
      <FormControl fullWidth error={errors.instrumentNumber ? true : false}>
        <InputLabel htmlFor="instrument-number">Instrument Number</InputLabel>
        {scanning ? (
          <React.Fragment>
            <Scanner onDetected={onDetected} />
            <Button onClick={() => setScanning(false)}>Stop Scanning</Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Input
              id="instrument-number"
              onChange={handleChange('instrumentNumber')}
              aria-describedby="instrument-number-error"
              type="text"
              value={instrumentNumber}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setScanning(true)}>
                    <FontAwesomeIcon icon={faBarcode} />
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.instrumentNumber && (
              <FormHelperText id="instrument-number-error">
                {errors.instrumentNumber}
              </FormHelperText>
            )}
          </React.Fragment>
        )}
      </FormControl>
      <Fields.InstrumentTypeSelect
        error={errors.instrumentType}
        onChange={handleChange('instrumentType')}
        value={instrumentType}
        required
      />
      <Fields.InstrumentSizeSelect
        error={errors.size}
        onChange={handleChange('size')}
        value={size}
        instrumentType={instrumentType}
        required
      />
      <Fields.LocationSelect
        error={errors.location}
        onChange={handleChange('location')}
        value={location}
        required
      />
      <FormControl fullWidth error={errors.assignedTo ? true : false}>
        <InputLabel htmlFor="student-name">Assigned To</InputLabel>
        <Input
          id="student-name"
          onChange={handleChange('assignedTo')}
          aria-describedby="student-name-error"
          type="text"
          value={assignedTo}
        />
        {errors.assignedTo && (
          <FormHelperText id="student-name-error">{errors.assignedTo}</FormHelperText>
        )}
      </FormControl>
      <FormControl fullWidth error={errors.maintenanceNotes ? true : false}>
        <InputLabel htmlFor="maintenance-notes">Maintenance Notes</InputLabel>
        <Input
          id="maintenance-notes"
          onChange={handleChange('maintenanceNotes')}
          aria-describedby="maintenance-notes-error"
          type="text"
          value={maintenanceNotes}
          multiline
        />
        {errors.maintenanceNotes && (
          <FormHelperText id="maintenance-notes-error">
            {errors.maintenanceNotes}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl fullWidth error={errors.conditionNotes ? true : false}>
        <InputLabel htmlFor="condition-notes">Condition Notes</InputLabel>
        <Input
          id="condition-notes"
          onChange={handleChange('conditionNotes')}
          aria-describedby="condition-notes-error"
          type="text"
          value={conditionNotes}
          multiline
        />
        {errors.conditionNotes && (
          <FormHelperText id="condition-notes-error">
            {errors.conditionNotes}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl fullWidth error={errors.condition ? true : false}>
        <InputLabel htmlFor="condition">Condition Rating</InputLabel>
        <Input
          type="number"
          id="condition"
          onChange={handleRating('condition')}
          aria-describedby="condition-error"
          value={condition}
        />
        {errors.condition && (
          <FormHelperText id="condition-error">{errors.condition}</FormHelperText>
        )}
      </FormControl>
      <FormControl fullWidth error={errors.quality ? true : false}>
        <InputLabel htmlFor="quality">Quality Rating</InputLabel>
        <Input
          type="number"
          id="quality"
          onChange={handleRating('quality')}
          aria-describedby="quality-error"
          value={quality}
        />
        {errors.quality && (
          <FormHelperText id="quality-error">{errors.quality}</FormHelperText>
        )}
      </FormControl>
      <FormGroup row>
        <FormControlLabel
          control={<Checkbox checked={rosin} onChange={handleCheck('rosin')} />}
          label="Rosin"
        />
        <FormControlLabel
          control={<Checkbox checked={bow} onChange={handleCheck('bow')} />}
          label="Bow"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={shoulderRestRockStop}
              onChange={handleCheck('shoulderRestRockStop')}
            />
          }
          label="Shoulder Rest/Rock Stop"
        />
        <FormControlLabel
          control={<Checkbox checked={readyToGo} onChange={handleCheck('readyToGo')} />}
          label="Ready To Go"
        />
        <FormControlLabel
          control={<Checkbox checked={gifted} onChange={handleCheck('gifted')} />}
          label="Gifted To Student"
        />
      </FormGroup>
      <input
        accept="image/*"
        id="upload-photo"
        type="file"
        className={classes.fileInput}
        onChange={handlePhoto}
      />
      <FormControl fullWidth error={errors.photo ? true : false}>
        <label htmlFor="upload-photo">
          <Button variant="contained" component="span" color="primary">
            Upload Photo
          </Button>
        </label>
        {errors.photo && (
          <FormHelperText id="photo-error">{errors.photo}</FormHelperText>
        )}
      </FormControl>
      <FormGroup row>
        <Button onClick={clearForm} className={classes.lastButton}>
          Clear
        </Button>
        <Button type="submit" color="primary" disabled={!validateForm()}>
          Submit
        </Button>
      </FormGroup>
    </form>
  )
}

InstrumentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
  instrumentNumber: PropTypes.string,
  instrumentType: PropTypes.string,
  size: PropTypes.string,
  location: PropTypes.string,
  assignedTo: PropTypes.string,
  maintenanceNotes: PropTypes.string,
  conditionNotes: PropTypes.string,
  condition: PropTypes.string,
  quality: PropTypes.string,
  rosin: PropTypes.bool,
  bow: PropTypes.bool,
  shoulderRestRockStop: PropTypes.bool,
  readyToGo: PropTypes.bool,
  gifted: PropTypes.bool,
  clearForm: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
}

export default InstrumentForm
