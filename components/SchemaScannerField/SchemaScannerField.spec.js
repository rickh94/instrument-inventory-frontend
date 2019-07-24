import React from 'react';
import { shallow } from 'enzyme';
import SchemaScannerField from './SchemaScannerField';

describe('<SchemaScannerField />', () => {
  test('renders', () => {
    const wrapper = shallow(<SchemaScannerField />);
    expect(wrapper).toMatchSnapshot();
  });
});
