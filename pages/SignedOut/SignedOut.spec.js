import React from 'react'
import { cleanup, render, act } from '@testing-library/react'
import SignedOut from './SignedOut'
import { API } from 'aws-amplify'
import { TestEverything, flushPromises } from '../../test-utils'

afterEach(cleanup)

describe('<SignedOut />', () => {
  it('matches snapshot', async () => {
    API.get = jest.fn().mockImplementation(() => Promise.resolve([]))
    const { container } = render(<SignedOut />, { wrapper: TestEverything })
    expect(container).toMatchSnapshot()
    await flushPromises()
    expect(API.get).toHaveBeenCalledWith('instrument-inventory', 'filter/signed-out')
  })
})
