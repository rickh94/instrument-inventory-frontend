import React from 'react'
import App from '../App'
import { render } from '@testing-library/react'
import { TestRouter, TestTheme } from '../test-utils'

describe('<App />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <TestTheme>
        <App />
      </TestTheme>,
      { wrapper: TestRouter }
    )
    expect(container).toMatchSnapshot()
  })
})
