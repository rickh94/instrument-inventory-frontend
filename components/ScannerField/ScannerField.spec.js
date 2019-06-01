import React from 'react';
import { shallow } from 'enzyme';
import ScannerField from './ScannerField';

describe('<ScannerField />', () => {
  test('renders', () => {
    const wrapper = shallow(<ScannerField />);
    expect(wrapper).toMatchSnapshot();
  });
});
