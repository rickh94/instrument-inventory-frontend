import React from 'react'
import NotFound from '../../pages/NotFound'
import { render } from '../../test-utils'

describe('<NotFound />', () => {
  it('matches snapshot', () => {
    const { container } = render(<NotFound />)
    expect(container).toMatchSnapshot()
  })
})
