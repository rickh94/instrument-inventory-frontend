import React from 'react'
import Search from '../../pages/Search'
import { render } from '../../test-utils'

describe('<Search />', () => {
  it('matches snapshot', () => {
    const { container } = render(<Search />)
    expect(container).toMatchSnapshot()
  })
})
