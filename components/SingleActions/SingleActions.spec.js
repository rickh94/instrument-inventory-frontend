import React from 'react';
import { shallow } from 'enzyme';
import SingleActions from './SingleActions';

describe('<SingleActions />', () => {
  test('renders', () => {
    const wrapper = shallow(<SingleActions />);
    expect(wrapper).toMatchSnapshot();
  });
});
