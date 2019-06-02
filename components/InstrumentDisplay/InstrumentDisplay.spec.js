import React from 'react'
import InstrumentDisplay from './InstrumentDisplay'
import { render } from '@testing-library/react'

describe('InstrumentDisplay', () => {
  it('matches snapshot', () => {
    const { container } = render(<InstrumentDisplay primary="test" secondary="test" />)
    expect(container).toMatchSnapshot()
  })
})
