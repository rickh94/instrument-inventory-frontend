import React from 'react';
import { shallow } from 'enzyme';
import RootPaper from './RootPaper';

describe('<RootPaper />', () => {
  test('renders', () => {
    const wrapper = shallow(<RootPaper />);
    expect(wrapper).toMatchSnapshot();
  });
});
