import React from 'react';
import { shallow } from 'enzyme';
import Single from './Single';

describe('<Single />', () => {
  test('renders', () => {
    const wrapper = shallow(<Single />);
    expect(wrapper).toMatchSnapshot();
  });
});
