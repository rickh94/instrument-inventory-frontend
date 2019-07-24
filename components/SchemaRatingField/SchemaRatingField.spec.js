import React from 'react';
import { shallow } from 'enzyme';
import SchemaRatingField from './SchemaRatingField';

describe('<SchemaRatingField />', () => {
  test('renders', () => {
    const wrapper = shallow(<SchemaRatingField />);
    expect(wrapper).toMatchSnapshot();
  });
});
