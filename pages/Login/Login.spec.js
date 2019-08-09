import React from 'react'
import Login from './Login'
import { render } from '@testing-library/react'

describe('<Login />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Login userHasAuthenticated={jest.fn()} showAlert={jest.fn()} />
    )
    expect(container).toMatchSnapshot()
  })
})
