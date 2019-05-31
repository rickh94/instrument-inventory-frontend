import React from 'react';
import { shallow } from 'enzyme';
import InstrumentDisplay from './InstrumentDisplay';

describe('<InstrumentDisplay />', () => {
  test('renders', () => {
    const wrapper = shallow(<InstrumentDisplay />);
    expect(wrapper).toMatchSnapshot();
  });
});
