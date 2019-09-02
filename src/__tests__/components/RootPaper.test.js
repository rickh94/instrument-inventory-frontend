import React from 'react'
import RootPaper from '../../components/RootPaper'
import { render } from '../../test-utils'

describe('<RootPaper />', () => {
  it('matches snapshot', () => {
    const { container } = render(<RootPaper />)
    expect(container).toMatchSnapshot()
  })
})
