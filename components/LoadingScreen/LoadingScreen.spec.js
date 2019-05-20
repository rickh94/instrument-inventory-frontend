import React from 'react';
import { shallow } from 'enzyme';
import LoadingScreen from './LoadingScreen';

describe('<LoadingScreen />', () => {
  test('renders', () => {
    const wrapper = shallow(<LoadingScreen />);
    expect(wrapper).toMatchSnapshot();
  });
});
