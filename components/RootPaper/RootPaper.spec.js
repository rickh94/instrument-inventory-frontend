import React from 'react'
import RootPaper from './RootPaper'
import { render } from '@testing-library/react'

describe('<RootPaper />', () => {
  it('matches snapshot', () => {
    const { container } = render(<RootPaper />)
    expect(container).toMatchSnapshot()
  })
})
