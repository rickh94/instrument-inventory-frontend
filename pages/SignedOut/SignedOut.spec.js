import React from 'react';
import { shallow } from 'enzyme';
import SignedOut from './SignedOut';

describe('<SignedOut />', () => {
  test('renders', () => {
    const wrapper = shallow(<SignedOut />);
    expect(wrapper).toMatchSnapshot();
  });
});
