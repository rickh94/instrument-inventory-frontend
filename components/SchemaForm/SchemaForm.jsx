import PropTypes from 'prop-types'
import React from 'react'

import Ajv from 'ajv'
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema'
import {
  AutoField,
  AutoFields,
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
} from 'uniforms-material'
import { Button, FormGroup } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'

import SchemaRatingField from '../SchemaRatingField'
import SchemaScannerField from '../SchemaScannerField'
import { lastButton } from '../../globalStyles'

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

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  lastButton,
}))

const SchemaForm = ({
  schema,
  initialData,
  omitFields = [],
  onSubmit,
  error,
  onChange,
  onCancel,
}) => {
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
      component: SchemaScannerField,
    }
  }
  if (schema.properties.quality) {
    schema.properties.quality.uniforms = {
      component: SchemaRatingField,
    }
  }
  if (schema.properties.condition) {
    schema.properties.condition.uniforms = {
      component: SchemaRatingField,
    }
  }

  if (initialData) {
    Object.keys(schema.properties).forEach(key => {
      if (initialData[key] === null || initialData[key] === undefined) {
        if (schema.properties[key].type === 'string') {
          initialData[key] = ''
        } else if (schema.properties[key].type === 'integer') {
          initialData[key] = 0
        }
      }
    })
  }

  const classes = useStyles()
  return (
    <AutoForm
      schema={bridge}
      onSubmit={onSubmit}
      error={error}
      showInlineError
      onChange={onChange}
      model={initialData}
      data-testid="schema-form"
    >
      <AutoFields omitFields={omitFields} />
      {schema.properties.password && (
        <AutoField component={TextField} type="password" name="password" />
      )}
      {schema.properties.confirm_password && (
        <AutoField component={TextField} type="password" name="confirm_password" />
      )}
      <ErrorsField />
      <FormGroup row>
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="text"
            className={clsx(classes.button, classes.lastButton)}
          >
            Cancel
          </Button>
        )}
        <SubmitField
          color="primary"
          variant="text"
          className={clsx(classes.button, !onCancel && classes.lastButton)}
        />
      </FormGroup>
    </AutoForm>
  )
}

SchemaForm.propTypes = {
  schema: PropTypes.object,
  initialData: PropTypes.object,
  omitFields: PropTypes.arrayOf(PropTypes.string),
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  error: PropTypes.object,
}

export default SchemaForm
