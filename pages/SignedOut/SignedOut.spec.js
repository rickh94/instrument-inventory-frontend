import React from 'react'
import { cleanup, render } from '@testing-library/react'
import SignedOut from './SignedOut'
import { API } from 'aws-amplify'

afterEach(cleanup)

describe('<SignedOut />', () => {
  it('matches snapshot', () => {
    API.get = jest.fn().mockImplementation(() => Promise.resolve([]))
    const { container } = render(<SignedOut showAlert={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })
})
