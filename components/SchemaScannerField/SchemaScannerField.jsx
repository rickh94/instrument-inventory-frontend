import React, { useState } from 'react'
import PropTypes from 'prop-types'

import connectField from 'uniforms/connectField'
import {
  FormControl,
  InputLabel,
  Button,
  Input,
  InputAdornment,
  FormHelperText,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'

import { Scanner, TooltipIconButton } from '..'

export const SchemaScannerField = ({ onChange, value, error, label, required }) => {
  const autoScan = JSON.parse(localStorage.getItem('autoScan', 'false'))
  const [scanning, setScanning] = useState(autoScan)

  const onDetected = result => {
    if (result.codeResult.code !== value) {
      setScanning(false)
      onChange(result.codeResult.code)
    }
  }

  return (
    <FormControl fullWidth error={error ? true : false}>
      <InputLabel htmlFor="scanner-field" required={required}>
        {label}
      </InputLabel>
      {scanning ? (
        <React.Fragment>
          <Scanner onDetected={onDetected} />
          <Button onClick={() => setScanning(false)} data-testid="stop-scanning-button">
            Stop Scanning
          </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Input
            id="scanner-field"
            onChange={event => onChange(event.target.value)}
            aria-describedby="scanner-error"
            type="text"
            value={value}
            required={required}
            data-testid="scanner-input"
            endAdornment={
              <InputAdornment position="end">
                <TooltipIconButton
                  onClick={() => setScanning(true)}
                  title="Scan Barcode"
                  data-testid="scan-button"
                >
                  <FontAwesomeIcon icon={faBarcode} />
                </TooltipIconButton>
              </InputAdornment>
            }
          />
          {error && <FormHelperText id="scanner-error">{error.message}</FormHelperText>}
        </React.Fragment>
      )}
    </FormControl>
  )
}

SchemaScannerField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.object,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
}

export default connectField(SchemaScannerField)
