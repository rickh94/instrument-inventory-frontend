import React from 'react';
import { shallow } from 'enzyme';
import InstrumentRow from './InstrumentRow';

describe('<InstrumentRow />', () => {
  test('renders', () => {
    const wrapper = shallow(<InstrumentRow />);
    expect(wrapper).toMatchSnapshot();
  });
});
