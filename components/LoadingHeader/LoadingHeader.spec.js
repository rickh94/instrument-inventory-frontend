import React from 'react';
import { shallow } from 'enzyme';
import LoadingHeader from './LoadingHeader';

describe('<LoadingHeader />', () => {
  test('renders', () => {
    const wrapper = shallow(<LoadingHeader />);
    expect(wrapper).toMatchSnapshot();
  });
});
