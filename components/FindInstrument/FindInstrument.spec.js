import React from 'react';
import { shallow } from 'enzyme';
import FindInstrument from './FindInstrument';

describe('<FindInstrument />', () => {
  test('renders', () => {
    const wrapper = shallow(<FindInstrument />);
    expect(wrapper).toMatchSnapshot();
  });
});
