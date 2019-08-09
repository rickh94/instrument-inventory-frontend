import React from 'react'
import RetrieveMultiple from './RetrieveMultiple'
import { render } from '@testing-library/react'

describe('<RetrieveMultiple />', () => {
  it('matches snapshot', () => {
    const { container } = render(<RetrieveMultiple />)
    expect(container).toMatchSnapshot()
  })
})
