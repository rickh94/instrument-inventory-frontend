import React from 'react';
import { shallow } from 'enzyme';
import SchemaForm from './SchemaForm';

describe('<SchemaForm />', () => {
  test('renders', () => {
    const wrapper = shallow(<SchemaForm />);
    expect(wrapper).toMatchSnapshot();
  });
});
