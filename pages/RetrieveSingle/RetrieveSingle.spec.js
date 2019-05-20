import React from 'react';
import { shallow } from 'enzyme';
import RetrieveSingle from './RetrieveSingle';

describe('<RetrieveSingle />', () => {
  test('renders', () => {
    const wrapper = shallow(<RetrieveSingle />);
    expect(wrapper).toMatchSnapshot();
  });
});
