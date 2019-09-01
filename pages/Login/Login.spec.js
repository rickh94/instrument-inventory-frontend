import React from 'react'
import Login from './Login'
import { render } from '@testing-library/react'
import { TestEverything } from '../../test-utils'

describe('<Login />', () => {
  test('matches snapshot', () => {
    const { container } = render(<Login userHasAuthenticated={jest.fn()} />, {
      wrapper: TestEverything,
    })
    expect(container).toMatchSnapshot()
  })
})
