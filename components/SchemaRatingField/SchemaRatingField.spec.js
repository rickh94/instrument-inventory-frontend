import React from 'react'
import { SchemaRatingField } from './SchemaRatingField'
import { render, cleanup } from '@testing-library/react'

afterEach(cleanup)

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

  it('renders a rating and a label', () => {
    const { container, queryByText } = render(
      <SchemaRatingField onChange={jest.fn()} value={0} label="Test" />
    )
    expect(container.querySelector('.Rating-root-93')).toBeTruthy()
    expect(queryByText('Test')).toBeTruthy()
  })
})
