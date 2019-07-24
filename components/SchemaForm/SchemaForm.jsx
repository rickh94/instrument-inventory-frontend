import React from 'react'
import PropTypes from 'prop-types'

import Ajv from 'ajv'
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema'
import {
  AutoForm,
  AutoFields,
  ErrorsField,
  SubmitField,
  TextField,
  AutoField
} from 'uniforms-material'
import { Typography } from '@material-ui/core'
import SchemaScannerField from '../SchemaScannerField/SchemaScannerField'

const ajv = new Ajv({ allErrors: true, useDefaults: true })

const createValidator = schema => {
  const validator = ajv.compile(schema)

  return model => {
    validator(model)
    if (validator.errors && validator.errors.length) {
      throw { details: validator.errors }
    }
  }
}

const SchemaForm = ({ schema, initialData, omitFields, onSubmit, error, onChange }) => {
  const schemaValidator = createValidator(schema)
  const bridge = new JSONSchemaBridge(schema, schemaValidator)
  if (schema.properties.password) {
    omitFields.push('password')
  }
  if (schema.properties.confirm_password) {
    omitFields.push('confirm_password')
  }
  if (schema.properties.number) {
    schema.properties.number.uniforms = {
      component: SchemaScannerField
    }
  }

  return (
    <AutoForm
      schema={bridge}
      onSubmit={onSubmit}
      error={error}
      showInlineError
      onChange={onChange}
    >
      <AutoFields omitFields={omitFields} />
      {schema.properties.password && (
        <AutoField component={TextField} type="password" name="password" />
      )}
      {schema.properties.confirm_password && (
        <AutoField component={TextField} type="password" name="confirm_password" />
      )}
      <ErrorsField />
      <SubmitField />
    </AutoForm>
  )
}

SchemaForm.propTypes = {
  schema: PropTypes.object.isRequired,
  initialData: PropTypes.object,
  omitFields: PropTypes.arrayOf(PropTypes.string),
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func
}

export default SchemaForm
