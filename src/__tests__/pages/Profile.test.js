import React from 'react'
import Profile from '../../pages/Profile'
import { Auth } from 'aws-amplify'
import { render } from '../../test-utils'

describe('<Profile />', () => {
  it('matches snapshot', () => {
    Auth.currentAuthenticatedUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve({}))
    const { container } = render(<Profile />)
    expect(container).toMatchSnapshot()
  })
})
