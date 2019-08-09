import React from 'react'
import PropTypes from 'prop-types'

import { FormControl, FormHelperText } from '@material-ui/core'
import Rating from 'material-ui-rating'
import connectField from 'uniforms/connectField'

export const SchemaRatingField = ({ onChange, value, error, label }) => (
  <FormControl fullWidth error={error ? true : false}>
    <label htmlFor="rating-field">{label}</label>
    <Rating
      id="rating-field"
      value={parseInt(value)}
      max={5}
      onChange={onChange}
    />
    {error && <FormHelperText id="rating-field">{error.message}</FormHelperText>}
  </FormControl>
)

SchemaRatingField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  error: PropTypes.object,
  label: PropTypes.string.isRequired,
}

export default connectField(SchemaRatingField)
