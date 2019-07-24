import React from 'react'

import { FormControl, FormHelperText } from '@material-ui/core'
import Rating from 'material-ui-rating'
import connectField from 'uniforms/connectField'

const SchemaRatingField = ({ onChange, value, error, label, required }) => (
  <FormControl fullWidth error={error ? true : false}>
    <label htmlFor="rating-field">{label}</label>
    <Rating id="rating-field" value={value} max={5} onChange={onChange} />
    {error && <FormHelperText id="rating-field">{error.message}</FormHelperText>}
  </FormControl>
)

export default connectField(SchemaRatingField)
