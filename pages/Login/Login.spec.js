import React from 'react';
import { shallow } from 'enzyme';
import Login from './Login';

import '../../setupTests'

describe('<Login />', () => {
  test('renders', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper).toMatchSnapshot();
  });
});
