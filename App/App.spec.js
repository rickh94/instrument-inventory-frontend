import React from 'react'
import { shallow } from 'enzyme'
import App from './App'

import '../setupTests'

describe('<App />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<App />)
  })

  test('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
