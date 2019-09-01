import React from 'react'
import Profile from './Profile'
import { render } from '@testing-library/react'
import { Auth } from 'aws-amplify'
import { TestEverything } from '../../test-utils';

describe('<Profile />', () => {
  it('matches snapshot', () => {
    Auth.currentAuthenticatedUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve({}))
    const { container } = render(<Profile />, {wrapper: TestEverything})
    expect(container).toMatchSnapshot()
  })
})
