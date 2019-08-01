import React from 'react'
import { SchemaRatingField } from './SchemaRatingField'
import { render } from '@testing-library/react'

describe('<SchemaRatingField />', () => {
  test('renders', () => {
    const { container } = render(
      <SchemaRatingField onChange={jest.fn()} value={1} error={null} label="Test" />
    )

    expect(container).toMatchSnapshot()
  })

  it('renders error', () => {
    const { getByText } = render(
      <SchemaRatingField
        onChange={jest.fn()}
        value={1}
        error={{ message: 'Try again' }}
        label="Test"
      />
    )
    expect(getByText('Try again')).toBeTruthy()
  })
})
