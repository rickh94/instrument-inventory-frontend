import React from 'react'
import App from './App'
import { render } from '@testing-library/react'
import { TestRouter } from '../test-utils'

describe('<App />', () => {
  it('matches snapshot', () => {
    const { container } = render(<App />, { wrapper: TestRouter })
    expect(container).toMatchSnapshot()
  })
})
