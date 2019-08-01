import React from 'react'
import { render } from '@testing-library/react'
import { InstrumentTable } from './InstrumentTable'

describe('<InstrumentTable />', () => {
  test('renders', () => {
    const { container } = render(
      <InstrumentTable records={[{}]} history={{ push: jest.fn() }} />
    )
    expect(container).toMatchSnapshot()
  })
})
