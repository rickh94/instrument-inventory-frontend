import React from 'react'
import Profile from './Profile'
import { render } from '@testing-library/react'
import { Auth } from 'aws-amplify'

describe('<Profile />', () => {
  it('matches snapshot', () => {
    Auth.currentAuthenticatedUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve({}))
    const { container } = render(<Profile showAlert={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })
})
