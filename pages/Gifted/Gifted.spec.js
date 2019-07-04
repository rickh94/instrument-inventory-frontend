import React from 'react';
import { shallow } from 'enzyme';
import Gifted from './Gifted';

describe('<Gifted />', () => {
  test('renders', () => {
    const wrapper = shallow(<Gifted />);
    expect(wrapper).toMatchSnapshot();
  });
});
