import React from 'react';
import { shallow } from 'enzyme';
import Create from './Create';

describe('<Create />', () => {
  test('renders', () => {
    const wrapper = shallow(<Create />);
    expect(wrapper).toMatchSnapshot();
  });
});
