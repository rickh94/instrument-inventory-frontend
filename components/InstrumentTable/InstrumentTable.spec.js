import React from 'react';
import { shallow } from 'enzyme';
import InstrumentTable from './InstrumentTable';

describe('<InstrumentTable />', () => {
  test('renders', () => {
    const wrapper = shallow(<InstrumentTable />);
    expect(wrapper).toMatchSnapshot();
  });
});
