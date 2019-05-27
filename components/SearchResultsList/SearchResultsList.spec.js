import React from 'react';
import { shallow } from 'enzyme';
import SearchResultsList from './SearchResultsList';

describe('<SearchResultsList />', () => {
  test('renders', () => {
    const wrapper = shallow(<SearchResultsList />);
    expect(wrapper).toMatchSnapshot();
  });
});
