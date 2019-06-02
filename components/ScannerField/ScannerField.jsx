import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  FormControl,
  InputLabel,
  Button,
  Input,
  InputAdornment,
  FormHelperText,
} from '@material-ui/core'
import { Scanner, TooltipIconButton } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'

const ScannerField = ({ error, value, setValue, label }) => {
  const [scanning, setScanning] = useState(false)

  const onDetected = result => {
    if (result.codeResult.code !== value) {
      setScanning(false)
      setValue(result.codeResult.code)
    }
  }

  return (
    <FormControl fullWidth error={error ? true : false}>
      <InputLabel data-testid="label" htmlFor="scanner-field">{label}</InputLabel>
      {scanning ? (
        <React.Fragment>
          <Scanner onDetected={onDetected} data-testid="scanner" />
          <Button onClick={() => setScanning(false)}>Stop Scanning</Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Input
            id="scanner-field"
            onChange={event => setValue(event.target.value)}
            aria-describedby="scanner-error"
            type="text"
            value={value}
            data-testid="input-field"
            required
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
          {error && <FormHelperText id="scanner-error">{error}</FormHelperText>}
        </React.Fragment>
      )}
    </FormControl>
  )
}

ScannerField.propTypes = {
  error: PropTypes.string,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
}

export default ScannerField
