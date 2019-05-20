import React from 'react';
import { shallow } from 'enzyme';
import RetrieveMultiple from './RetrieveMultiple';

describe('<RetrieveMultiple />', () => {
  test('renders', () => {
    const wrapper = shallow(<RetrieveMultiple />);
    expect(wrapper).toMatchSnapshot();
  });
});
