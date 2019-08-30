import React from 'react'
import LoadingScreen from './LoadingScreen'
import { render, cleanup } from '@testing-library/react'

afterEach(cleanup)

describe('<LoadingScreen />', () => {
  it('matches snapshot', () => {
    const { container } = render(<LoadingScreen />)
    expect(container).toMatchSnapshot()
    console.log(container.innerHTML)
    expect(0).toBeTruthy()
  })



})
