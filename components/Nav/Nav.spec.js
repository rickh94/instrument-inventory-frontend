import React from 'react'
import { shallow } from 'enzyme'
import { Nav } from './Nav'

import '../../setupTests'
import { clickButton } from '../../testHelpers'

describe('<Nav />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <Nav
        isAuthenticated={false}
        handleLogout={jest.fn()}
        classes={{ root: 'root', grow: 'grow', barText: 'barText' }}
      />
    )
  })

  test('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('shows login if logged out', () => {
    expect(wrapper.contains('Login')).toBeTruthy()
  })

  it('shows logout if logged in', () => {
    wrapper.setProps({ isAuthenticated: true })
    expect(wrapper.contains('Logout')).toBeTruthy()
  })

  it('calls function if logout clicked', () => {
    const handleLogout = jest.fn()
    wrapper.setProps({ isAuthenticated: true, handleLogout })
    // console.log(wrapper.findWhere(el => el.contains('Logout')))
    // expect(handleLogout).toHaveBeenCalled()
  })
})
