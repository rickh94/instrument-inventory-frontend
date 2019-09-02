import React from 'react'
import { SchemaRatingField } from '../../components/SchemaRatingField'
import { render, cleanup } from '../../test-utils'

afterEach(cleanup)

beforeAll(() => {
  // eslint-disable-next-line no-console
  console.error = jest.fn()
})

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
    const { queryByText } = render(
      <SchemaRatingField onChange={jest.fn()} value={0} label="Test" />
    )
    expect(queryByText('Test')).toBeTruthy()
    expect(queryByText('Test').nextElementSibling.className).toContain('Rating')
  })
})
