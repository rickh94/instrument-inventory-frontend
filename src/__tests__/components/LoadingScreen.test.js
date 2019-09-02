import React from 'react'
import LoadingScreen from '../../components/LoadingScreen'
import { render, cleanup } from '../../test-utils'

afterEach(cleanup)

describe('<LoadingScreen />', () => {
  test('renders loader', () => {
    const { container } = render(<LoadingScreen />)
    expect(container.querySelectorAll('rect').length).not.toBe(0)
  })
})
