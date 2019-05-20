import React from 'react';
import { shallow } from 'enzyme';
import Scanner from './Scanner';

describe('<Scanner />', () => {
  test('renders', () => {
    const wrapper = shallow(<Scanner />);
    expect(wrapper).toMatchSnapshot();
  });
});
