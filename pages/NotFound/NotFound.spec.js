import React from 'react'
import NotFound from './NotFound'
import { render } from '@testing-library/react'

describe('<NotFound />', () => {
  it('matches snapshot', () => {
    const { container } = render(<NotFound />)
    expect(container).toMatchSnapshot()
  })
})
