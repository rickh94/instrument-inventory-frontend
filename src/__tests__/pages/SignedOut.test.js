import React from 'react'
import { cleanup, render, flushPromises } from '../../test-utils'
import SignedOut from '../../pages/SignedOut'
import { API } from 'aws-amplify'

afterEach(cleanup)

describe('<SignedOut />', () => {
  it('matches snapshot', async () => {
    API.get = jest.fn().mockImplementation(() => Promise.resolve([]))
    const { container } = render(<SignedOut />)
    expect(container).toMatchSnapshot()
    await flushPromises()
    expect(API.get).toHaveBeenCalledWith('instrument-inventory', 'filter/signed-out')
  })
})
