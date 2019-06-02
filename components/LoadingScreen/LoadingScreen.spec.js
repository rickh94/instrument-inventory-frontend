import React from 'react'
import LoadingScreen from './LoadingScreen'
import { render } from '@testing-library/react'

describe('<LoadingScreen />', () => {
  it('matches snapshot', () => {
    const { container } = render(<LoadingScreen />)
    expect(container).toMatchSnapshot()
  })
})
