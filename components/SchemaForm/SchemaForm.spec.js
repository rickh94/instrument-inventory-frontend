import React from 'react'
import SchemaForm from './SchemaForm'
import { render } from '@testing-library/react'

describe('<SchemaForm />', () => {
  test('renders', () => {
    const { container } = render(
      <SchemaForm
        schema={{}}
        initialData={{}}
        onSubmit={jest.fn()}
        onChange={jest.fn()}
        onCancel={jest.fn()}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
