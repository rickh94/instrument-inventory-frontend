import React from 'react'
import SchemaForm from './SchemaForm'
import { render, cleanup, fireEvent } from '@testing-library/react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'

afterEach(cleanup)

describe('<SchemaForm />', () => {
  test('renders', () => {
    const { container } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <SchemaForm
          schema={{ properties: {} }}
          initialData={{}}
          onSubmit={jest.fn()}
          onChange={jest.fn()}
          onCancel={jest.fn()}
        />
      </MuiThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('renders schema', () => {
    const testSchema = {
      type: 'object',
      properties: {
        testNumber: {
          title: 'Test Number',
          description: 'Number',
          type: 'number',
        },
        stuff: {
          title: 'Stuff',
          description: 'A Text Input',
          type: 'string',
        },
        choice: {
          title: 'Choice',
          description: 'Some choices',
          enum: ['a1', 'b2', 'c3', 'd4'],
        },
      },
    }
    const { queryByText, container } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <SchemaForm
          schema={testSchema}
          onSubmit={jest.fn()}
          onChange={jest.fn()}
          onCancel={jest.fn()}
        />
      </MuiThemeProvider>
    )
    expect(queryByText('Test Number')).toBeTruthy()
    expect(queryByText('Stuff')).toBeTruthy()
    expect(queryByText('Choice')).toBeTruthy()

    expect(container.querySelector('input[name="stuff"]')).toBeTruthy()
    expect(container.querySelector('input[name="stuff"]').type).toEqual('text')

    expect(container.querySelector('input[name="testNumber"]')).toBeTruthy()
    expect(container.querySelector('input[name="testNumber"]').type).toEqual('number')

    expect(container.querySelector('input[name="choice"]')).toBeTruthy()
    expect(container.querySelector('input[name="choice"]').type).toEqual('hidden')

    expect(queryByText('Submit')).toBeTruthy()
    expect(queryByText('Cancel')).toBeTruthy()
  })

  test('renders a scanner field for a number in schema', () => {
    const testSchema = {
      type: 'object',
      properties: {
        number: {
          title: 'Number',
          description: 'Scanning Number',
          type: 'string',
        },
      },
    }
    const { queryByText, container } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <SchemaForm schema={testSchema} onSubmit={jest.fn()} onChange={jest.fn()} />
      </MuiThemeProvider>
    )
    expect(queryByText('Number')).toBeTruthy()

    expect(queryByText('Scan Barcode')).toBeTruthy()
    expect(container.querySelector('input#scanner-field')).toBeTruthy()

    expect(queryByText('Submit')).toBeTruthy()
  })

  test('renders cancel if onCancel prop, and calls', () => {
    const testSchema = {
      type: 'object',
      properties: {
        stuff: {
          title: 'Stuff',
          description: 'A Text Input',
          type: 'string',
        },
      },
    }
    const onCancel = jest.fn()
    const { queryByText } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <SchemaForm
          schema={testSchema}
          onSubmit={jest.fn()}
          onChange={jest.fn()}
          onCancel={onCancel}
        />
      </MuiThemeProvider>
    )
    expect(queryByText('Cancel')).toBeTruthy()
    fireEvent.click(queryByText('Cancel'))
    expect(onCancel).toHaveBeenCalled()
  })

  test('does not render cancel if no onCancel prop', () => {
    const testSchema = {
      type: 'object',
      properties: {
        stuff: {
          title: 'Stuff',
          description: 'A Text Input',
          type: 'string',
        },
      },
    }
    const { queryByText } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <SchemaForm schema={testSchema} onSubmit={jest.fn()} onChange={jest.fn()} />
      </MuiThemeProvider>
    )
    expect(queryByText('Cancel')).toBeFalsy()
  })

  test('calls onSubmit with correct values', async () => {
    const testSchema = {
      type: 'object',
      properties: {
        testNumber: {
          title: 'Test Number',
          description: 'Number',
          type: 'number',
        },
        stuff: {
          title: 'Stuff',
          description: 'A Text Input',
          type: 'string',
        },
        choice: {
          title: 'Choice',
          description: 'Some choices',
          enum: ['a1', 'b2', 'c3', 'd4'],
        },
      },
    }
    const onSubmit = jest.fn()
    const { container } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <SchemaForm
          schema={testSchema}
          onSubmit={onSubmit}
          onChange={jest.fn()}
          onCancel={jest.fn()}
        />
      </MuiThemeProvider>
    )
    fireEvent.change(container.querySelector('input[name="stuff"]'), {
      target: { value: 'stuff value' },
    })
    fireEvent.change(container.querySelector('input[name="testNumber"]'), {
      target: { value: 5 },
    })

    fireEvent.click(container.querySelector('button[type="submit"]'))

    // eslint-disable-next-line no-undef
    await new Promise(resolve => process.nextTick(resolve))

    expect(onSubmit).toHaveBeenCalledWith({
      stuff: 'stuff value',
      testNumber: 5,
    })
  })

  test('renders password and confirm password as password fields', () => {
    const testSchema = {
      type: 'object',
      properties: {
        password: {
          title: 'Password',
          description: 'User Password',
          type: 'string',
        },
        confirm_password: {
          title: 'Confirm Password',
          description: 'Confirm User Password',
          type: 'string',
        },
      },
    }
    const { queryByText, container } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <SchemaForm
          schema={testSchema}
          onSubmit={jest.fn()}
          onChange={jest.fn()}
          onCancel={jest.fn()}
        />
      </MuiThemeProvider>
    )
    expect(queryByText('Password')).toBeTruthy()
    expect(queryByText('Confirm Password')).toBeTruthy()

    expect(container.querySelector('input[name="password"]')).toBeTruthy()
    expect(container.querySelector('input[name="password"]').type).toEqual('password')

    expect(container.querySelector('input[name="confirm_password"]')).toBeTruthy()
    expect(container.querySelector('input[name="confirm_password"]').type).toEqual(
      'password'
    )
  })

  test('renders rating field for quality and condition', () => {
    const testSchema = {
      type: 'object',
      properties: {
        quality: {
          title: 'Quality',
          type: 'number',
        },
        condition: {
          title: 'Condition',
          type: 'number',
        },
      },
    }
    const { queryByText, container } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <SchemaForm
          schema={testSchema}
          onSubmit={jest.fn()}
          onChange={jest.fn()}
          onCancel={jest.fn()}
        />
      </MuiThemeProvider>
    )

    expect(queryByText('Quality')).toBeTruthy()
    expect(queryByText('Condition')).toBeTruthy()
    expect(container.querySelectorAll('.Rating-root-646').length).toEqual(2)
  })
})
