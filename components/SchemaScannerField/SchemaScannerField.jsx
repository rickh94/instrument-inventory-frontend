import React, { useState } from 'react'
import PropTypes from 'prop-types'

import connectField from 'uniforms/connectField'
import {
  FormControl,
  InputLabel,
  Button,
  Input,
  InputAdornment,
  FormHelperText
} from '@material-ui/core'
import { Scanner, TooltipIconButton } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'

const SchemaScannerField = ({ onChange, value, error, label, required }) => {
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
          <Button onClick={() => setScanning(false)}>Stop Scanning</Button>
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

SchemaScannerField.propTypes = {}

export default connectField(SchemaScannerField)
