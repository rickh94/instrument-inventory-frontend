import React from 'react'
import Login from '../../pages/Login'
import { render } from '../../test-utils'

describe('<Login />', () => {
  test('matches snapshot', () => {
    const { container } = render(<Login userHasAuthenticated={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })
})
