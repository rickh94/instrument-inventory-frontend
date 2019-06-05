import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, InputLabel, NativeSelect } from '@material-ui/core'

export const InstrumentTypeSelect = ({ error, value, onChange, required = false }) => (
  <FormControl fullWidth error={error ? true : false}>
    <InputLabel htmlFor="instrument-type">Instrument Type</InputLabel>
    <NativeSelect
      id="instrument-type"
      onChange={onChange}
      required={required}
      value={value}
    >
      <option value="" />
      <option value="violin">Violin</option>
      <option value="viola">Viola</option>
      <option value="cello">Cello</option>
      <option value="bass">Bass</option>
      <option value="violin strug as viola">Violin strung as viola</option>
    </NativeSelect>
  </FormControl>
)

InstrumentTypeSelect.propTypes = {
  error: PropTypes.any,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
}

export const InstrumentSizeSelect = ({
  error,
  onChange,
  value,
  instrumentType,
  required = false,
}) => (
  <FormControl fullWidth error={error ? true : false}>
    <InputLabel htmlFor="size">Size</InputLabel>
    <NativeSelect id="size" onChange={onChange} required={required} value={value}>
      <option value="" />
      {instrumentType === 'viola' ? (
        <React.Fragment>
          <option value={'12"'}>12&quot;</option>
          <option value={'13"'}>13&quot;</option>
          <option value={'14"'}>14&quot;</option>
          <option value={'15"'}>15&quot;</option>
          <option value={'15.5"'}>15.5&quot;</option>
          <option value={'16"'}>16&quot;</option>
          <option value={'16.5"'}>16.5&quot;</option>
          <option value={'17"'}>17&quot;</option>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <option value="4/4">4/4</option>
          <option value="3/4">3/4</option>
          <option value="1/2">1/2</option>
          <option value="1/4">1/4</option>
          <option value="1/8">1/8</option>
          <option value="1/10">1/10</option>
          <option value="1/16">1/16</option>
          <option value="1/32">1/32</option>
        </React.Fragment>
      )}
    </NativeSelect>
  </FormControl>
)

InstrumentSizeSelect.propTypes = {
  error: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  instrumentType: PropTypes.string.isRequired,
  required: PropTypes.bool,
}

export const LocationSelect = ({ error, onChange, value, required = false }) => (
  <FormControl fullWidth error={error ? true : false}>
    <InputLabel htmlFor="location">Location</InputLabel>
    <NativeSelect id="location" onChange={onChange} required={required} value={value}>
      <option value="" />
      <option value="Grant Elementary School">Grant Elementary School</option>
      <option value="Hedgepath Middle School">Hedgepath Middle School</option>
      <option value="Wilson Elementary School">Wilson Elementary School</option>
      <option value="Trenton High School">Trenton High School</option>
      <option value="Columbus Elementary School">Columbus Elementary School</option>
      <option value="office">Office</option>
      <option value="Storage">Storage</option>
      <option value="trade">trade</option>
      <option value="maintenance">Maintenance</option>
      <option value="transit">Transit</option>
    </NativeSelect>
  </FormControl>
)

LocationSelect.propTypes = {
  error: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  required: PropTypes.bool,
}
