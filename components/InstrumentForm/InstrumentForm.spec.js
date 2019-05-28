import React from 'react';
import { shallow } from 'enzyme';
import InstrumentForm from './InstrumentForm';

describe('<InstrumentForm />', () => {
  test('renders', () => {
    const wrapper = shallow(<InstrumentForm />);
    expect(wrapper).toMatchSnapshot();
  });
});
