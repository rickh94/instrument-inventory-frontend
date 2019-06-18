import React from 'react';
import { shallow } from 'enzyme';
import Everything from './Everything';

describe('<Everything />', () => {
  test('renders', () => {
    const wrapper = shallow(<Everything />);
    expect(wrapper).toMatchSnapshot();
  });
});
